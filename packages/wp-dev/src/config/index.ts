import { existsSync } from 'fs';
import { fromProjectRoot } from '@wordpress/scripts/utils';
import { applyFilters } from '@wordpress/hooks';

import { WpDevConfiguration, CommanderOptions } from '../types';
import { corePlugins } from '..//plugins';

export const initConfig = async (
	options: CommanderOptions
): Promise< WpDevConfiguration > => {
	const userConfig = await getUserConfig( options );
	const defaultConfig: Partial< WpDevConfiguration > = {
		wpDev: {
			plugins: [ ...corePlugins ],
		},
	};
	const config = mergeConfigs( defaultConfig, userConfig );
	return applyFilters( 'wp-dev/config', config ) as WpDevConfiguration;
};

const getUserConfig = async (
	options: CommanderOptions
): Promise< Partial< WpDevConfiguration > > => {
	if ( options[ 'config' ] ) {
		const configPath = fromProjectRoot( options[ 'config' ] );
		if ( existsSync( configPath ) ) {
			return import( configPath );
		} else {
			throw new Error( `File not found ${ configPath }` );
		}
	}

	const configPath = fromProjectRoot( 'wpdev.config.js' );

	if ( existsSync( configPath ) ) {
		return import( configPath );
	}

	return {};
};

const mergeConfigs = (
	defaultConfig: Partial< WpDevConfiguration >,
	userConfig: Partial< WpDevConfiguration >
): WpDevConfiguration => {
	return {
		...defaultConfig,
		...userConfig,
		wpDev: {
			plugins: [
				...( defaultConfig?.wpDev?.plugins ?? [] ),
				...( userConfig?.wpDev?.plugins ?? [] ),
			],
		},
	};
};
