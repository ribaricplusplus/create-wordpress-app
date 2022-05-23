import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { applyFilters } from '@wordpress/hooks';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { mkdir } from 'fs/promises';
import { fromProjectRoot } from '@wordpress/scripts/utils';
import Handlebars from 'handlebars';
import tar from 'tar';

import LocalServer from '../../interfaces/local-server';
import RemoteServer from '../../interfaces/remote-server';
import { dependsOn } from './depends-on';
import { CommandCommanderOptions } from '../../types';
import Config from './interfaces/config';
import { moveFiles, forceMove } from './legacy/file';

@injectable()
export default class SyncController {
	public localServer: LocalServer;
	public remoteServer: RemoteServer;

	constructor(
		@inject( dependsOn.LocalServer ) localServer: LocalServer,
		@inject( dependsOn.RemoteServer ) remoteServer: RemoteServer
	) {
		this.localServer = localServer;
		this.remoteServer = remoteServer;
	}

	async push( config: Config, options: CommandCommanderOptions ) {
		//
	}

	async run( config: Config, options: CommandCommanderOptions ) {
		try {
			await this.remoteServer.connect( config );
			const missingDependencies =
				await this.getMissingSystemAndServerDependencies();

			if ( missingDependencies.length > 0 ) {
				for ( const dependency of missingDependencies ) {
					console.error(
						`Error: Missing ${ dependency.type } dependency: ${ dependency.name }`
					);
				}
				return;
			}

			if ( ! ( await this.localServer.isStarted() ) ) {
				// We're not starting the server because we don't know what
				// parameters a user would want to start a server with... Maybe they
				// want it to start with --xdebug, for example.
				console.error(
					'Local server not started. Please start it first so that synchronization can complete.'
				);
				return;
			}

			const downloadFilesFromServer = applyFilters(
				'wp-dev-plugin-sync-download-callback',
				this.downloadFilesFromServer.bind( this )
			) as Function | SyncController[ 'downloadFilesFromServer' ];

			const { tarPath, dbDumpName } = await downloadFilesFromServer(
				config,
				options
			);

			const extractPath = fromProjectRoot( '.wp-dev-cache/extracted' );

			await this.extractFiles( tarPath, extractPath );
			await this.importFiles( extractPath, config, options );
			await this.importDatabase( path.join( extractPath, dbDumpName ) );
			await this.fixDatabasePaths( config );
		} finally {
			await this.remoteServer.disconnect();
		}
	}

	async fixDatabasePaths( config: Config ) {
		if ( ! config.transformPaths ) {
			return;
		}

		for ( const [ oldPath, newPath ] of Object.entries(
			config.transformPaths
		) ) {
			await this.localServer.searchReplace( oldPath, newPath );
		}
	}

	async extractFiles( tarballPath: string, extractPath: string ) {
		if ( ! fs.existsSync( extractPath ) ) {
			await mkdir( extractPath, { recursive: true } );
		}

		tar.x( {
			cwd: extractPath,
			file: tarballPath,
			sync: true,
		} );
	}

	async getMissingSystemAndServerDependencies(): Promise<
		Array< { type: 'system' | 'server'; name: string } >
	> {
		const missing: Awaited<
			ReturnType<
				SyncController[ 'getMissingSystemAndServerDependencies' ]
			>
		> = [];

		const serverCommands = [ 'tar', 'wp' ];

		for ( const c of serverCommands ) {
			const { code } = await this.remoteServer.execScript(
				`#!/usr/bin/env bash\n ${ c } --version`
			);

			if ( code !== 0 ) {
				missing.push( { type: 'server', name: c } );
			}
		}

		return missing;
	}

	async downloadFilesFromServer(
		config: Config,
		options: CommandCommanderOptions
	): Promise< { tarPath: string; dbDumpName: string } | void > {
		const view = {
			wordPressPath: config.wordPressPath,
			dbDump: 'wp-dev-dbdump.sql',
			tarball: 'wp-dev-sync.tar.gz',
			lockFile: 'sync-in-progress.lock',
			files: options[ 'files' ] ?? [],
			codes: {
				SYNC_IN_PROGRESS: 100,
			},
		};

		let script = `
#!/usr/bin/env bash

set -e;

cd ${ view.wordPressPath };
if [ -a ${ view.lockFile } ]; then exit ${
			view.codes[ 'SYNC_IN_PROGRESS' ]
		}; fi;
echo 'in-progress' > ${ view.lockFile };
wp db export ${ view.dbDump };
tar -czf ${ view.tarball } ${ view.dbDump } ${ view.files.join( ' ' ) };
`;

		const { code } = await this.remoteServer.execScript( script, {
			logOutput: true,
		} );

		const attemptCleanup = async () => {
			const s = `
#!/usr/bin/env bash

cd {{ wordPressPath }};
rm -f {{ tarball }} {{ dbDump }};
rm -f {{ lockFile }};

`;
			await this.remoteServer.execScript(
				Handlebars.compile( s )( view )
			);
		};

		if ( code !== 0 ) {
			await attemptCleanup();
			switch ( code ) {
				case view.codes.SYNC_IN_PROGRESS:
					throw new Error(
						`A sync is already in progress. Perhaps someone else is currently synchronizing. If this is a mistake, delete the ${
							view.wordPressPath + '/' + view.lockFile
						} file on the remote server.`
					);
				default:
					throw new Error(
						'An error occurred while downloading files.'
					);
			}
		}

		try {
			const downloadDestinationDir = fromProjectRoot(
				'.wp-dev-cache/download'
			);

			if ( ! fs.existsSync( downloadDestinationDir ) ) {
				await mkdir( downloadDestinationDir, { recursive: true } );
			}

			const tarPath = `${ downloadDestinationDir }/${ view.tarball }`;

			await this.remoteServer.download(
				`${ view.wordPressPath }/${ view.tarball }`,
				tarPath
			);

			return { tarPath, dbDumpName: view.dbDump };
		} finally {
			await attemptCleanup();
		}
	}

	/**
	 * Source files are usually going to be a partial copy of a WordPress installation, for example:
	 *
	 * /
	 * |__ wp-content/
	 * |____ plugins/
	 * |______ plugin1/
	 * |____ themes/
	 * |____ uploads/
	 *
	 * @param source Path to the files to import into local server.
	 */
	async importFiles(
		source: string,
		config: Config,
		options: CommandCommanderOptions
	) {
		const wpRoot = await this.localServer.getWpRoot();
		const wpContentPath = path.join( wpRoot, 'wp-content' );

		const specialDirs = {
			'wp-content/plugins': {
				tarPath: 'wp-content/plugins',
				destinationDirectory: wpContentPath,
				...( config.plugins && {
					excludeSubdirs: new Set( config.plugins ),
				} ),
			},
			'wp-content/themes': {
				tarPath: 'wp-content/themes',
				destinationDirectory: wpContentPath,
				...( config.themes && {
					excludeSubdirs: new Set( config.themes ),
				} ),
			},
		};

		await moveFiles( {
			extractDestination: source,
			moveSpecification: options[ 'files' ].map( ( file ) => {
				if ( specialDirs[ file ] ) {
					return specialDirs[ file ];
				}

				return {
					tarPath: file,
					destinationDirectory: wpContentPath,
				};
			} ),
		} );
	}

	async importDatabase( sqlFilePath: string ) {
		const wpRoot = await this.localServer.getWpRoot();
		await forceMove( sqlFilePath, wpRoot );
		await this.localServer.importDatabaseDump(
			path.basename( sqlFilePath )
		);
	}
}
