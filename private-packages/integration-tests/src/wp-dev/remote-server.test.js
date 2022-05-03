const os = require( 'os' );
const path = require( 'path' );

const RemoteServer =
	require( '@ribarich/wp-dev/src/plugins/sync/remote-server' ).default;

function createRemoteServer() {
	return new RemoteServer();
}

describe( 'RemoteServer', () => {
	describe( 'connection', () => {
		const server = createRemoteServer();

		afterEach( async () => {
			await server.disconnect();
		} );

		it( 'Can connect to remote machine', async () => {
			await expect(
				server.connect( {
					ssh: {
						host: '192.168.56.125',
						username: 'vagrant',
						privateKeyPath: path.join(
							os.homedir(),
							'.ssh/id_rsa'
						),
						port: 22,
					},
				} )
			).resolves.not.toThrow();
		} );
	} );

	describe( 'execScript', () => {
		const server = createRemoteServer();

		beforeAll( async () => {
			await server.connect( {
				ssh: {
					host: '192.168.56.125',
					username: 'vagrant',
					privateKeyPath: path.join( os.homedir(), '.ssh/id_rsa' ),
					port: 22,
				},
			} );
		} );

		afterAll( async () => {
			await server.disconnect();
		} );

		it( 'Returns expected output for ls in test folder.', async () => {
			const script = `
#/usr/bin/env bash
set -e
cd /home/vagrant/testfolder
ls
`;

			const { output, code } = await server.execScript( script );
			expect( output.length ).toBeGreaterThan( 0 );
			expect( code ).toBe( 0 );
			expect( output ).toMatchSnapshot();
		} );
	} );
} );
