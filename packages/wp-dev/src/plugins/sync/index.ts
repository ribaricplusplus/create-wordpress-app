import { addFilter } from '@wordpress/hooks';
import os from 'os';
import path from 'path';

import {
	CommandConfiguration,
	CommanderActionGenerator,
	PluginInitOptions,
	CommandCommanderOptions,
	WpDevConfiguration,
} from '../../types';
import { provides } from './provides';
import type SyncController from './SyncController';

const sync: CommanderActionGenerator = ( config, container ) => async (
	options: CommandCommanderOptions
) => {
	const controller = container.get(
		provides.SyncController.symbol
	) as InstanceType< typeof SyncController >;
	controller.run( config, options );
};

const commandConfig: CommandConfiguration = {
	command: [ 'sync' ],
	description: [ 'Synchronize local server with upstream.' ],
	action: sync,
};

const init = () => {
	addFilter(
		'wp-dev-commands-configurations',
		'wp-dev/plugins/sync/add-commands',
		( commands ) => [ ...commands, commandConfig ]
	);
	addFilter(
		'wp-dev-service-definitions',
		'wp-dev/plugins/sync/add-service-definitions',
		( definitions ) => {
			return { ...definitions, ...provides };
		}
	);
	addFilter(
		'wp-dev-config',
		'wp-dev/plugins/sync/config',
		( config: WpDevConfiguration ) => {
			const defaults = {
				ssh: {
					privateKeyPath: path.join( os.homedir() ),
				},
			};
		}
	);
};

export const pluginConfig = {
	init,
};
