const RunIntegrationTests = require( '../src/commands/run-integration-tests' )
	.default;
const VagrantUtils = require( '../src/vagrant-utils' ).default;

function createRunIntegrationTests() {
	return new RunIntegrationTests( new VagrantUtils() );
}

describe( 'RunIntegrationTests', () => {
	describe( 'getVagrantSnapshots', () => {
		const instance = createRunIntegrationTests();

		it( 'Works when there is an initial snapshot.', () => {
			const list = `
1644682327,client,metadata,provider,virtualbox
1644682327,server,metadata,provider,virtualbox
1644682327,client,ui,output,==> client:
1644682327,client,ui,detail,initial-install
1644682327,server,ui,output,==> server:
1644682327,server,ui,detail,initial-install
`;
			const snapshots = instance.getVagrantSnapshots( list );
			expect( snapshots.client ).toEqual( [ 'initial-install' ] );
			expect( snapshots.server ).toEqual( [ 'initial-install' ] );
		} );

		it( 'Works when there are no snapshots', () => {
			const list = `
1644682327,client,metadata,provider,virtualbox
1644682327,server,metadata,provider,virtualbox
1644682327,client,ui,output,==> client:
1644682327,server,ui,output,==> server:
`;
			const snapshots = instance.getVagrantSnapshots( list );
			expect( snapshots.client ).toEqual( [] );
			expect( snapshots.server ).toEqual( [] );
		} );

		it( 'Works when there are multiple snapshots', () => {
			const list = `
1644837638,client,metadata,provider,virtualbox
1644837639,server,metadata,provider,virtualbox
1644837639,client,ui,output,==> client:
1644837639,client,ui,detail,another-snapshot
1644837639,client,ui,detail,initial-install
1644837639,server,ui,output,==> server:
1644837639,server,ui,detail,another-snapshot
1644837639,server,ui,detail,initial-install
`;
			const snapshots = instance.getVagrantSnapshots( list );
			expect( snapshots.client ).toEqual( [
				'another-snapshot',
				'initial-install',
			] );
			expect( snapshots.server ).toEqual( [
				'another-snapshot',
				'initial-install',
			] );
		} );
	} );
} );
