const { execSync } = require( 'child_process' );
const path = require( 'path' );

const bringUpServer = async () => {
	console.log( 'Bringing up test server.' );

	const cwd = process.cwd();

	process.chdir( path.join( __dirname, 'server' ) );

	execSync( 'vagrant up', { stdio: 'inherit' } );

	process.chdir( cwd );
};

const tearDownServer = async () => {
	console.log( 'Tearing down test server.' );

	const cwd = process.cwd();

	process.chdir( path.join( __dirname, 'server' ) );

	execSync( 'vagrant suspend', { stdio: 'inherit' } );

	process.chdir( cwd );
};
