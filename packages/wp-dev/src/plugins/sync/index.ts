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
import Config from './interfaces/config';
import { extendConfig } from './config';

const sync: CommanderActionGenerator =
	( config, container ) => async ( options: CommandCommanderOptions ) => {
		const controller = container.get(
			provides.SyncController.symbol
		) as InstanceType< typeof SyncController >;
		await controller.run( config as Config, options );
	};

const commandConfig: CommandConfiguration = {
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
		'wp-dev/plugins/sync/extendConfig',
		extendConfig
	);
};

export const pluginConfig = {
	init,
};
