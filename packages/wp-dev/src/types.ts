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

export interface PluginInitOptions {
	commanderOptions: CommanderOptions;
	config: WpDevConfiguration;
}

export interface ServiceDefinitions {
	[ service: string ]: ServiceDefinition;
}

export interface ServiceDefinition {
	symbol: symbol;
	implementation: any;
	// Takes a container and registers the service
	registrationCallback?: Function;
}
