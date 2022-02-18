require( 'reflect-metadata' );
const { Container } = require( 'inversify' );
const { rm, readdir } = require( 'fs/promises' );
const path = require( 'path' );
const os = require( 'os' );
const fs = require( 'fs' );

const { initContainer } = require( '@ribarich/wp-dev/src/index.ts' );
const SyncController = require( '@ribarich/wp-dev/src/plugins/sync/SyncController' )
	.default;
const { getCachePath } = require( '@ribarich/wp-dev/src/util' );

const config = {
	ssh: {
		host: '192.168.56.125',
		username: 'vagrant',
		privateKeyPath: path.join( os.homedir(), '.ssh/id_rsa' ),
		port: 22,
	},
	wordPressPath: '/var/www/wordpress',
};

const commanderOptions = {
	files: [ 'wp-content/plugins', 'wp-content/themes', 'wp-content/uploads' ],
};

describe( 'Synchronization plugin', () => {
	const container = new Container( { defaultScope: 'Singleton' } );
	let syncController;

	beforeAll( async () => {
		await initContainer( container, {} );
		syncController = container.get( Symbol.for( 'SyncController' ) );
	} );

	it( 'Is available in container', async () => {
		expect( syncController ).toBeInstanceOf( SyncController );
	} );

	describe( 'Download feature', () => {
		beforeAll( async () => {
			await syncController.remoteServer.connect( config );
		} );

		afterAll( async () => {
			await syncController.remoteServer.disconnect();
		} );

		afterEach( async () => {
			if ( fs.existsSync( getCachePath() ) ) {
				await rm( getCachePath(), { recursive: true } );
			}
		} );

		it( 'Downloads WordPress files from remote server correctly', async () => {
			await expect(
				syncController.downloadFilesFromServer(
					config,
					commanderOptions
				)
			).resolves.toBeTruthy();
			expect(
				fs.existsSync(
					path.join( getCachePath(), 'download/wp-dev-sync.tar.gz' )
				)
			).toBeTruthy();

			// Test that cleanup is done properly
			const { code } = await syncController.remoteServer.execScript(
				`#!/usr/bin/env bash\ncd ${ config.wordPressPath }; if [ -a sync-in-progress.lock ]; then exit 50; else exit 51; fi;`
			);

			// Code 51 = file does not exist
			expect( code ).toBe( 51 );
		} );

		it( 'Correctly extracts downloaded files', async () => {
			const { tarPath } = await syncController.downloadFilesFromServer(
				config,
				commanderOptions
			);

			expect( fs.existsSync( tarPath ) ).toBeTruthy();

			const extractPath = path.join( getCachePath(), 'extracted' );

			await syncController.extractFiles( tarPath, extractPath );

			const files = ( await readdir( extractPath ) ).filter(
				( file ) => file !== '.' && file !== '..'
			);

			expect( files.length ).toBeGreaterThan( 1 );
		} );
	} );
} );