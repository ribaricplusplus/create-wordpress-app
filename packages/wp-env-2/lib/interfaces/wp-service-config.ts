import type WPSource from './wp-source'

export default interface WPServiceConfig {

	// The WordPress installation to load in the environment.
	coreSource?: WPSource

	// Plugins to load in the environment.
	pluginSources: WPSource[]

	// Themes to load in the environment.
	themeSources: WPSource[]

	// The port to use.
	port: number

	// Mapping of wp-config.php constants to their desired values.
	config: object

	// Mapping of WordPress directories to local directories which should be mounted.
	mappings: { string: WPSource }

	// Version of PHP to use in the environments, of the format 0.0.
	phpVersion: string

	// Multisite.
	multisite: boolean
}
