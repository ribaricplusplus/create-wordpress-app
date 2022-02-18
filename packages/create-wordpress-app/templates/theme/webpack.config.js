const baseConfig = require( '@wordpress/scripts/config/webpack.config.js' );

module.exports = {
	...baseConfig,
	output: {
		...baseConfig.output,
		filename: '[name].bundle.js',
	},
	entry: {
		main: './js/main/index.js',
	},
};
