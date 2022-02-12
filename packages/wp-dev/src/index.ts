import { program } from 'commander';
import { applyFilters } from '@wordpress/hooks';
import type { Container } from 'inversify';

import packageJson from '../package.json';
import { safeCall } from './util';
import { initConfig } from './config';
import { validateCommanderOptions } from './config/validation';
import {
	CommanderOptions,
	CommandConfiguration,
	ServiceDefinitions,
	WpDevConfiguration,
} from './types';
import { container } from './container';

export async function initContainer(
	c: Container,
	options: CommanderOptions
): Promise< { config: WpDevConfiguration } > {
	let config = await initConfig( options );

	if ( config?.wpDev?.plugins && Array.isArray( config.wpDev.plugins ) ) {
		for ( const pluginConfig of config.wpDev.plugins ) {
			await pluginConfig.init( { commanderOptions: options, config } );
		}
	}

	try {
		// Let plugins add their own configuration options
		config = applyFilters( 'wp-dev-config', config ) as WpDevConfiguration;
	} catch ( e: any ) {
		/*
		 * Actually expecting that this will be the Joi validation error
		 */
		if ( e.name === 'ValidationError' ) {
			console.error( 'Configuration validation error occurred.' );
			console.error( e.details.message );
		}
		throw e;
	}

	const serviceDefinitions = applyFilters(
		'wp-dev-service-definitions',
		{}
	) as ServiceDefinitions;

	for ( const [ identifier, definition ] of Object.entries(
		serviceDefinitions
	) ) {
		if ( typeof definition === 'function' ) {
			definition( c );
		} else {
			c.bind( definition.symbol ).to( definition.implementation );
		}
	}

	return { config };
}

export async function cli() {
	program.version( packageJson[ 'version' ] );

	program.option( '-c, --config <path>', 'path to custom config file' );

	program.parse();

	let options = program.opts() as CommanderOptions;
	const optsValidationResult = validateCommanderOptions( options );

	if ( optsValidationResult.error ) {
		throw optsValidationResult.error;
	}

	const initResult = await safeCall( initContainer, container, options );

	if ( ! initResult ) {
		return;
	}

	const { config } = initResult;

	const commandsConfigurations: CommandConfiguration[] = applyFilters(
		'wp-dev-commands-configurations',
		[]
	) as CommandConfiguration[];

	for ( const commandConfiguration of commandsConfigurations ) {
		const command = program
			.command( ...commandConfiguration.command )
			.description( ...commandConfiguration.description );

		if ( commandConfiguration.options ) {
			for ( const option of commandConfiguration.options ) {
				command.option( ...option );
			}
		}

		command.action( commandConfiguration.action( config, container ) );
	}

	await program.parseAsync();
}
