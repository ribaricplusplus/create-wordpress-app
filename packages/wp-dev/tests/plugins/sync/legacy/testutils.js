const fs = require( 'fs' );

// Returns function that throws error if filePath does not exist.
function checkExistence( filePath ) {
	return () => {
		if ( ! fs.existsSync( filePath ) ) {
			throw new Error();
		}
	};
}

module.exports = { checkExistence };
