import 'reflect-metadata';
import { Container } from 'inversify';

import LocalServer from '../../../src/interfaces/local-server';
import RemoteServer from '../../../src/interfaces/remote-server';
import SyncController from '../../../src/plugins/sync/SyncController';

describe( 'SyncController', () => {
	it( 'Can be instantiated', () => {
		const container = new Container();
		container
			.bind( Symbol.for( 'LocalServer' ) )
			.toConstantValue( jest.fn() );
		container
			.bind( Symbol.for( 'RemoteServer' ) )
			.toConstantValue( jest.fn() );
		container
			.bind< SyncController >( Symbol.for( 'SyncController' ) )
			.to( SyncController );

		const instance = container.get< SyncController >(
			Symbol.for( 'SyncController' )
		);
		expect( instance.localServer ).toBeTruthy();
	} );
} );
