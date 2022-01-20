import { program } from 'commander';
import { applyFilters } from '@wordpress/hooks';

import packageJson from '../package.json';
import { initConfig } from './config';
import { validateCommanderOptions } from './config/validation';
import {
	CommanderOptions,
	CommandConfiguration,
	ServiceDefinitions,
} from './types';
import { container } from './container';

export async function cli() {
	program.version( packageJson[ 'version' ] );

	program.option( '-c, --config <path>', 'path to custom config file' );

	program.parse();

	let options = program.opts() as CommanderOptions;
	const optsValidationResult = validateCommanderOptions( options );

	if ( optsValidationResult.error ) {
		throw optsValidationResult.error;
	}

	let config = await initConfig( options );

	if ( config?.wpDev?.plugins && Array.isArray( config.wpDev.plugins ) ) {
		for ( const pluginConfig of config.wpDev.plugins ) {
			await pluginConfig.init( { commanderOptions: options, config } );
		}
	}

	const serviceDefinitions = applyFilters(
		'wp-dev-service-definitions',
		{}
	) as ServiceDefinitions;

	for ( const [ identifier, definition ] of Object.entries(
		serviceDefinitions
	) ) {
		if ( definition.registrationCallback ) {
			definition.registrationCallback( container );
		} else {
			container.bind( definition.symbol ).to( definition.implementation );
		}
	}

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
