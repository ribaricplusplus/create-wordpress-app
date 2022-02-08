import type { Command, CommandOptions } from 'commander';
import type { Container } from 'inversify';

export type ContainerInstance = InstanceType< typeof Container >;

export type CommanderAction = ( ...args: any[] ) => any;

type MethodParameters< T extends CommanderAction > = Readonly<
	Parameters< T >
>;

export type CommanderActionGenerator = (
	config: WpDevConfiguration,
	container: ContainerInstance
) => CommanderAction;

// Not using MethodParameters sometimes because the overload messes it up
// see https://github.com/microsoft/TypeScript/issues/32164
export interface CommandConfiguration {
	command: [ nameAndArgs: string, opts?: CommandOptions ];
	action: CommanderActionGenerator;
	description: [ string ];
	options?: Array< MethodParameters< Command[ 'option' ] > >;
}

export interface WpDevConfiguration {
	[key: string]: any;
	wpDev?: MetaWpDevConfiguration;
}

export interface MetaWpDevConfiguration {
	plugins?: WpDevPluginConfig[];
}

export interface WpDevPluginConfig {
	init: ( options: PluginInitOptions ) => unknown;
}

export interface CommanderOptions {
	config?: string;
}

/**
 * Commander commands receive commander options as an argument.
 *
 * CommanderOptions are known, they are whatever options we define with
 * program.option before initializing user configuration. However, after user
 * configuration is run, a user can add their own options... So we don't know
 * what the options are. In reality it's an extension of CommanderOptions, but
 * it's probably not worthwhile to write types for all options.
 */
export type CommandCommanderOptions = object;

export interface PluginInitOptions {
	commanderOptions: CommanderOptions;
	config: WpDevConfiguration;
}

export interface ServiceDefinitions {
	[ service: string ]: ServiceDefinition | ServiceRegistrationCallback;
}

// Takes a container and registers the service
export type ServiceRegistrationCallback = ( container: Container ) => void

export interface ServiceDefinition {
	symbol: symbol;
	implementation: any;
}
