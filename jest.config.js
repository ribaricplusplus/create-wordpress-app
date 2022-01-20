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
	],
};
