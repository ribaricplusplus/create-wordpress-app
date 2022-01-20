import WpEnvLocalServer from './WpEnvLocalServer';
import { ServiceDefinitions } from '../../types';

export const provides: ServiceDefinitions = {
	LocalServer: {
		symbol: Symbol.for( 'LocalServer' ),
		implementation: WpEnvLocalServer,
	},
};
