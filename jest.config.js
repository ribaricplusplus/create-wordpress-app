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
	],
};
