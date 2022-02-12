const baseConfig = {
	preset: 'ts-jest',
	testEnvironment: 'node',
};

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	projects: [
		{
			...baseConfig,
			displayName: 'wp-dev',
			rootDir: '<rootDir>/packages/wp-dev',
		},
		{
			...baseConfig,
			displayName: 'wp-env-2',
			rootDir: '<rootDir>/packages/wp-env-2',
		},
		{
			// These are meant to be run within Vagrant, using cwapp-scripts.
			...baseConfig,
			displayName: 'integration-tests',
			rootDir: '<rootDir>/private-packages/integration-tests',
		},
		{
			...baseConfig,
			displayName: 'e2e-tests',
			rootDir: '<rootDir>/private-packages/e2e-tests',
		},
		{
			...baseConfig,
			displayName: 'scripts',
			rootDir: '<rootDir>/private-packages/scripts',
		},
	],
};
