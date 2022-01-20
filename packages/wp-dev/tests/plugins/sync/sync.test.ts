import 'reflect-metadata';
import { Container, injectable } from 'inversify';

import LocalServer from '../../../src/interfaces/local-server';
import SyncController from '../../../src/plugins/sync/SyncController';

@injectable()
class MockLocalServer implements LocalServer {
	start() {
		throw new Error();
	}
}

describe( 'SyncController', () => {
	it( 'Can be instantiated', () => {
		const container = new Container();
		container
			.bind< LocalServer >( Symbol.for( 'LocalServer' ) )
			.to( MockLocalServer );
		container
			.bind< SyncController >( Symbol.for( 'SyncController' ) )
			.to( SyncController );

		const instance = container.get< SyncController >(
			Symbol.for( 'SyncController' )
		);
		expect( instance.localServer ).toBeTruthy();
	} );
} );
