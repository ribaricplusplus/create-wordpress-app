import 'reflect-metadata';
import { injectable } from 'inversify';
import { execSync } from 'child_process';
import { readConfig } from '@wordpress/env/lib/config';
import path from 'path';
import fs from 'fs';

import type LocalServer from '../../interfaces/local-server';
import { inProjectRoot, inDirectory } from '../../util';
import { fromProjectRoot } from '@wordpress/scripts/utils';

@injectable()
export default class WpEnvLocalServer implements LocalServer {
	async isStarted(): Promise< boolean > {
		const workDirectoryPath = await this.getWorkDirectoryPath();

		if ( ! fs.existsSync( workDirectoryPath ) ) {
			return false;
		}

		let isStarted = false;

		await inDirectory( workDirectoryPath, () => {
			const output = execSync( 'docker-compose ps -q' );
			if ( !! output.toString().trim() ) {
				isStarted = true;
			}
		} );

		return isStarted;
	}

	async getWpRoot(): Promise< string > {
		const workDirectoryPath = await this.getWorkDirectoryPath();
		return path.join( workDirectoryPath, 'WordPress' );
	}

	async importDatabaseDump( dbDumpName ) {
		await inProjectRoot( () => {
			execSync( `npx wp-env run cli 'wp db import ${ dbDumpName }'`, {
				stdio: 'inherit',
			} );
		} );
	}

	async searchReplace( oldPath, newPath ) {
		await inProjectRoot( () => {
			execSync(
				`npx wp-env run cli 'wp search-replace ${ oldPath } ${ newPath } --all-tables'`
			);
		} );
	}

	private async getWorkDirectoryPath() {
		const { workDirectoryPath } = await readConfig(
			fromProjectRoot( '.wp-env.json' )
		);
		return workDirectoryPath;
	}
}
