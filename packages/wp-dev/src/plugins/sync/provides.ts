import SyncController from './SyncController';
import RemoteServer from './remote-server';
import { ServiceDefinition, ServiceRegistrationCallback } from '../../types';

type Provides = {
	SyncController: ServiceDefinition;
	RemoteServer: ServiceRegistrationCallback;
};

export const provides: Provides = {
	SyncController: {
		symbol: Symbol.for( 'SyncController' ),
		implementation: SyncController,
	},

	RemoteServer: ( container ) => {
		container
			.bind( Symbol.for( 'RemoteServer' ) )
			.to( RemoteServer )
			.inTransientScope();
	},
};
