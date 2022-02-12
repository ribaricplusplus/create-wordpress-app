const { execSync } = require( 'child_process' );
const { writeFile, mkdir, rm } = require( 'fs/promises' );
const fs = require( 'fs' );
const { fromProjectRoot } = require( '@wordpress/scripts/utils' );
const path = require( 'path' );
const { nanoid } = require( 'nanoid' );

async function execScript( script, machine = 'client', _options = {} ) {
	const defaultOptions = {
		execSync: {},
	};
	const options = {
		...defaultOptions,
		..._options,
	};
	const modifiedScript = ( () => {
		if ( machine === 'client' ) {
			return `\
#!/usr/bin/env bash

# Load NVM
export NVM_DIR="$HOME/.nvm";
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh";

${ script }
`;
		} else {
			return `\
#!/usr/bin/env bash

${ script }
`;
		}
	} )();

	const tempPath = fromProjectRoot( 'private-packages/e2e-tests/tmp' );

	if ( ! fs.existsSync( tempPath ) ) {
		await mkdir( tempPath, { recursive: true } );
	}

	const scriptName = `script-${ nanoid() }.sh`;

	const scriptPath = path.join( tempPath, scriptName );

	try {
		await writeFile( scriptPath, modifiedScript, { mode: 0o777 } );

		try {
			const output = execSync(
				`vagrant ssh ${ machine } -c /vagrant/private-packages/e2e-tests/tmp/${ scriptName }`,
				options.execSync
			);
			return { output };
		} catch ( e ) {
			console.error( 'Exec script command failed' );
			console.error( modifiedScript );
			console.error( e.message );

			if ( e.stdout ) {
				console.error( e.stdout.toString() );
			}

			if ( e.stderr ) {
				console.error( e.stderr.toString() );
			}

			throw e;
		}
	} finally {
		await rm( scriptPath, { recursive: true } );
	}
}

/*
 * Note that these tests do not clean up after themselves and leave dirty server
 * and client state.
 */
describe( 'Sync', () => {
	beforeAll( async () => {
		execSync( 'vagrant snapshot restore initial-install', {
			stdio: 'inherit',
		} );
		const setupRepo = `\
cd ~; \
mkdir -p e2e-tests; \
cp -Rf /vagrant/private-packages/e2e-tests/fixtures/repo ./e2e-tests; \
cd e2e-tests/repo; \
npm install; \
`;
		await execScript( setupRepo );
		execSync( 'vagrant snapshot save --force e2e-sync-test', {
			stdio: 'inherit',
		} );
	} );

	describe( 'Local server', () => {
		const preamble = `
cd ~/e2e-tests/repo;
`;
		it( 'Can start correctly', async () => {
			await execScript(
				`${ preamble } ./node_modules/.bin/wp-env start`
			);
			const { output } = await execScript(
				`${ preamble } ./node_modules/.bin/wp-env install-path`
			);
			expect( output.toString() ).toMatchSnapshot();
			await execScript( `${ preamble }npx wp-env stop` );
		} );
	} );

	describe( 'wp-dev sync', () => {
		const preamble = `
set -e;
cd ~/e2e-tests/repo;
`;

		beforeAll( async () => {
			const serverDataScript = `\
cd /var/www/wordpress;
wp option add e2e_tests_option e2e_tests_val;
mkdir -p wp-content/plugins/e2e-tests-plugin-dir;
echo 'Hello world' > wp-content/plugins/e2e-tests-plugin-dir/file.txt;
`;

			const syncScript = `\
${ preamble }
npx wp-env start;
npx wp-dev sync;
`;

			await execScript( serverDataScript, 'server' );

			await execScript( syncScript );
		} );

		it( 'Imports database', async () => {
			const { output } = await execScript(
				`\
${ preamble }
npx wp-env run cli 'wp option get e2e_tests_option'
`
			);

			expect( output.toString() ).toMatchSnapshot();
		} );

		it( 'Imports files', async () => {
			const { output } = await execScript( `\
${ preamble }
WPENV_DIR_PATH=$( npx wp-env install-path );
cd $WPENV_DIR_PATH;
if [ -a ./WordPress/wp-content/plugins/e2e-tests-plugin-dir/file.txt ]; then echo 'has file'; else echo 'does not have file'; fi;
` );

			// Should have file.
			expect( output.toString() ).toMatchSnapshot();
		} );
	} );
} );
