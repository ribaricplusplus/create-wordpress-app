const os = require( 'os' );
const path = require( 'path' );

module.exports = {
	wordPressPath: '/var/www/wordpress',
	ssh: {
		host: '192.168.56.125',
		username: 'vagrant',
		privateKeyPath: path.join( os.homedir(), '.ssh/id_rsa' ),
		port: 22,
	},
};
