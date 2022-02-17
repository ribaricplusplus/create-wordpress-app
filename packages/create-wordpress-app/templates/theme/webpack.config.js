const baseConfig = require( '@wordpress/scripts/config/webpack.config.js' );

module.exports = {
	...baseConfig,
	entry: {
		main: './js/main/index.js',
	},
};
