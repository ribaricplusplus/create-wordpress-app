const fs = require( 'fs' );
const path = require( 'path' );
const os = require( 'os' );
const { rm } = require( 'fs/promises' );

const { moveFiles } = require( '../../../../src/plugins/sync/legacy/file' );
const { checkExistence } = require( './testutils' );

let tempDir = null;
let installPath = null;
let extractDestination = null;

describe( 'moveFiles', () => {
	beforeAll( () => {
		tempDir = fs.mkdtempSync( `${ os.tmpdir() }${ path.sep }` );
		extractDestination = path.join( __dirname, 'testarchive' );
		installPath = path.join( tempDir, 'installed' );
	} );

	afterAll( async () => {
		await rm( tempDir, { recursive: true } );
	} );

	beforeEach( () => {
		fs.mkdirSync( installPath );
	} );

	afterEach( async () => {
		if ( fs.existsSync( installPath ) ) {
			await rm( installPath, { recursive: true } );
		}
	} );

	it( 'Moves directories without ignoring anything.', async () => {
		await moveFiles( {
			extractDestination,
			moveSpecification: [
				{
					tarPath: 'plugins',
					destinationDirectory: installPath,
				},
				{
					tarPath: 'themes',
					destinationDirectory: installPath,
				},
				{
					tarPath: 'uploads',
					destinationDirectory: installPath,
				},
			],
		} );

		expect(
			checkExistence( path.join( installPath, 'plugins' ) )
		).not.toThrow();
		expect(
			checkExistence( path.join( installPath, 'plugins', 'page-blocks' ) )
		).not.toThrow();
		expect(
			// Do not change "local488" here when reusing this code in a new project.
			checkExistence( path.join( installPath, 'themes', 'local488' ) )
		).not.toThrow();
		expect(
			checkExistence( path.join( installPath, 'dbdump.txt' ) )
		).toThrow();
	} );

	it( 'Moves files without ignoring anything.', async () => {
		await moveFiles( {
			extractDestination,
			moveSpecification: [
				{
					tarPath: 'dbdump.txt',
					destinationDirectory: installPath,
				},
			],
		} );

		expect(
			checkExistence( path.join( installPath, 'dbdump.txt' ) )
		).not.toThrow();
	} );

	it( 'Ignores specified directories while moving others.', async () => {
		await moveFiles( {
			extractDestination,
			moveSpecification: [
				{
					tarPath: 'plugins',
					destinationDirectory: installPath,
					excludeSubdirs: new Set( [ 'page-blocks' ] ),
				},
				{
					tarPath: 'themes',
					destinationDirectory: installPath,
				},
				{
					tarPath: 'uploads',
					destinationDirectory: installPath,
				},
			],
		} );

		expect(
			checkExistence( path.join( installPath, 'plugins', 'page-blocks' ) )
		).toThrow();
		expect(
			checkExistence(
				path.join( installPath, 'plugins', 'other-plugin' )
			)
		).not.toThrow();
	} );
} );
