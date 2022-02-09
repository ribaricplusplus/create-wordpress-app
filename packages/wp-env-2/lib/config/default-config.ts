export const defaultConfiguration = {
	core: null,
	phpVersion: null,
	plugins: [],
	themes: [],
	port: 8888,
	mappings: {},
	config: {
		WP_DEBUG: true,
		SCRIPT_DEBUG: true,
		WP_ENVIRONMENT_TYPE: 'local',
		WP_PHP_BINARY: 'php',
		WP_TESTS_EMAIL: 'admin@example.org',
		WP_TESTS_TITLE: 'Test Blog',
		WP_TESTS_DOMAIN: 'http://localhost',
		WP_SITEURL: 'http://localhost',
		WP_HOME: 'http://localhost',
	},
	multisite: false,
	env: {
		development: {}, // No overrides needed, but it should exist.
		tests: {
			config: { WP_DEBUG: false, SCRIPT_DEBUG: false },
			port: 8889,
		},
	},
};
