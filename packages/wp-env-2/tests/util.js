const path = require( 'path' );
const readConfig = require( '../lib/config/config' );

async function getConfig() {
	const fsPromises = jest.requireActual( 'fs/promises' );
	const wpEnvConfig = {
		core: 'WordPress/WordPress',
		plugins: [],
	};
	const readFile = jest.spyOn( fsPromises, 'readFile' );
	readFile.mockResolvedValue( JSON.stringify( wpEnvConfig ) );
	const config = await readConfig( path.resolve( './wp-env.json' ) );
	readFile.mockRestore();
	return config;
}

module.exports = {
	getConfig,
};
