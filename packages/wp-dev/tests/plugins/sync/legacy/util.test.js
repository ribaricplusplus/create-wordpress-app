const fs = require( 'fs' );
const { rm } = require( 'fs/promises' );
const os = require( 'os' );
const path = require( 'path' );

const {
	forceMove,
	writeTempFile,
} = require( '../../../../src/plugins/sync/legacy/file' );
const { checkExistence } = require( './testutils' );

let tempDir = null;
let sourceDir = null;
let destDir = null;

describe( 'forceMove', () => {
	beforeAll( () => {
		tempDir = fs.mkdtempSync( `${ os.tmpdir() }${ path.sep }` );
		sourceDir = path.join( tempDir, 'source' );
		destDir = path.join( tempDir, 'destination' );
	} );

	afterAll( async () => {
		await rm( tempDir, { recursive: true } );
	} );

	beforeEach( () => {
		fs.mkdirSync( sourceDir );
		fs.mkdirSync( path.join( sourceDir, 'dir' ) );
		const fileNames = [ 'file1', 'file2', 'file3', 'file4' ];
		for ( const fileName of fileNames ) {
			fs.writeFileSync( path.join( sourceDir, fileName ), 'hi there' );
		}
		fs.mkdirSync( destDir );
	} );

	afterEach( async () => {
		await rm( sourceDir, { recursive: true } );
		await rm( destDir, { recursive: true } );
	} );

	it( 'Moves regular files correctly.', async () => {
		await forceMove( path.join( sourceDir, 'file1' ), destDir );
		expect( checkExistence( path.join( destDir, 'file1' ) ) ).not.toThrow();
	} );

	it( 'Moves directories without overwriting correctly.', async () => {
		await forceMove( path.join( sourceDir, 'dir' ), destDir );
		expect( checkExistence( path.join( destDir, 'dir' ) ) ).not.toThrow();
	} );

	it( 'Moves directories with overwriting correctly.', async () => {
		fs.mkdirSync( path.join( destDir, 'dir' ) );
		fs.writeFileSync( path.join( sourceDir, 'dir', 'file' ), 'hi' );
		await forceMove( path.join( sourceDir, 'dir' ), destDir );
		expect(
			checkExistence( path.join( destDir, 'dir', 'file' ) )
		).not.toThrow();
	} );
} );
