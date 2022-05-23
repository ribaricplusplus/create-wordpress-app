import { addFilter } from '@wordpress/hooks';

import {
	CommandConfiguration,
	CommanderActionGenerator,
	CommandCommanderOptions,
} from '../../types';
import { provides } from './provides';
import type SyncController from './SyncController';
import Config from './interfaces/config';
import { extendConfig } from './config';

const sync: CommanderActionGenerator =
	( config, container ) => async ( options: CommandCommanderOptions ) => {
		const controller = container.get(
			provides.SyncController.symbol
		) as SyncController;
		await controller.run( config as Config, options );
	};

const push: CommanderActionGenerator =
	( config, container ) => async ( options: CommandCommanderOptions ) => {
	    const controller = container.get(
		    provides.SyncController.symbol
		) as SyncController
		await controller.push( config as Config, options )
	}

const syncCommandConfig: CommandConfiguration = {
	command: [ 'sync' ],
	description: [ 'Synchronize local server with upstream.' ],
	action: sync,
	options: [
		[
			'--files <files...>',
			'Files to sync, relative to WordPress root.',
			[ 'wp-content/plugins', 'wp-content/themes', 'wp-content/uploads' ],
		],
	],
};

const pushCommandConfig: CommandConfiguration = {
	command: [ 'push' ],
	description: [ 'Push local files to upstream.' ],
	action: push
}

const init = () => {
	addFilter(
		'wp-dev-commands-configurations',
		'wp-dev/plugins/sync/add-commands',
		( commands ) => [ ...commands, syncCommandConfig, pushCommandConfig ]
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
		'wp-dev/plugins/sync/extendConfig',
		extendConfig
	);
};

export const pluginConfig = {
	init,
};
