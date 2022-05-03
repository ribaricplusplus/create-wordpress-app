const { existsSync } = require( 'fs' );

const { getConfig } = require( './util' );
const DAO = require( '../lib/data/dao' ).default;

describe( 'Data Access Object', () => {
	let db = null;
	let config = null;

	beforeAll( async () => {
		db = DAO.getInstance();
		config = await getConfig();
		await db.init( config );
	} );

	afterAll( async () => {
		await db.destroy();
	} );

	it( 'Can create a table', async () => {
		await db.run( `
			CREATE TABLE IF NOT EXISTS test_table (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				value TEXT
			)
		` );

		expect( existsSync( db.dbPath ) ).toBeTruthy();
	} );
} );
