const os = require('os')
const path = require('path')

module.exports = {
	themes: [ '{{ name }}' ],

	/*
	 * Path to WordPress on remote server.
	 */
	wordPressPath: '/var/www/html',

	/*
	 * Paths to transform in database. Key is old path, value is new path. This
	 * don't need to necessarily be URLs. The tool that is used for transforming
	 * is wp search-replace (WordPress CLI).
	 */
//	transformPaths: {
//		'http://www.example.com': 'http://localhost:8888'
//	},

	/*
	 * Remote server SSH configuration.
	 */
//	ssh: {
//		host: 'www.example.com',
//		port: 22,
//		username: 'TODO'
//		privateKeyPath: path.join( os.homedir(), '.ssh/id_ecdsa' )
//	},
}
