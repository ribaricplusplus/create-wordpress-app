import { existsSync } from 'fs';
import { fromProjectRoot } from '@wordpress/scripts/utils';
import { applyFilters } from '@wordpress/hooks';
import path from 'path';

import { WpDevConfiguration, CommanderOptions } from '../types';
import { corePlugins } from '..//plugins';

export const initConfig = async (
	options: CommanderOptions
): Promise< WpDevConfiguration > => {
	try {
		const userConfig = await getUserConfig( options );
		const defaultConfig: WpDevConfiguration = {
			plugins: [],
			themes: [],
			wpDev: {
				plugins: [ ...corePlugins ],
			},
		};
		const config = mergeConfigs( defaultConfig, userConfig );
		return config;
	} catch ( e ) {
		console.error( 'An error occurred while initializing configuration.' );
		console.error( e );
		throw e;
	}
};

const getUserConfig = async (
	options: CommanderOptions
): Promise< Partial< WpDevConfiguration > > => {
	if ( options[ 'config' ] ) {
		const configPath = path.isAbsolute( options[ 'config' ] )
			? options[ 'config' ]
			: fromProjectRoot( options[ 'config' ] );
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
	defaultConfig: WpDevConfiguration,
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
