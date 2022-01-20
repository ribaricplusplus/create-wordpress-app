import SyncController from './SyncController';
import { ServiceDefinitions } from '../../types';

export const provides: ServiceDefinitions = {
	SyncController: {
		symbol: Symbol.for( 'SyncController' ),
		implementation: SyncController,
	},
};
