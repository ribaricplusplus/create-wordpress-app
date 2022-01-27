import type WPServiceConfig from './wp-service-config'

export default interface WPConfig {
	// Name of the environment.
	name: string,

	// Path to the .wp-env.json file.
	configDirectoryPath: string

	// Path to the work directory located in ~/.wp-env.
	workDirectoryPath: string

	// Path to the docker-compose.yml file.
	dockerComposeConfigPath: string

	// If true, wp-env detected local config and used it.
	detectedLocalConfig: string

	// Specific config for different environments.
	env: { [ env: string ]: WPServiceConfig }

	// True if debug mode is enabled.
	debug: boolean
}
