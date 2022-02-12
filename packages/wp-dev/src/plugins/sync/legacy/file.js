const path = require( 'path' );
const fs = require( 'fs' );
const { rm, cp } = require( 'fs/promises' );
const os = require( 'os' );

/**
 * Options takes a property moveSpecification, extractDestination and copy.
 *
 * By default, files will be copied, not moved.
 *
 * extractDestination is the path to where the files to move are. The name is
 * unfortunate, should be changed.
 *
 * moveSpecification is an array of objects with the following properties:
 *
 * tarPath: Path to a directory or file in the tarball.
 * destinationDirectory: Where to put tarPath.
 * excludeSubdirs: Optional. Set<string> of subdirectories to exclude from tarPath directory.
 *
 * @param {Object} options Options. See description.
 */
async function moveFiles( options ) {
	const { extractDestination } = options;
	const copy = options?.copy ?? true;
	for ( const move of options.moveSpecification ) {
		const extractedFile = path.join( extractDestination, move.tarPath );

		if ( ! fs.existsSync( extractedFile ) ) {
			// Ignore files that are not there.
			continue;
		}

		const fileStat = fs.statSync( extractedFile );

		if ( fileStat.isFile() || ! move.excludeSubdirs ) {
			await forceMove( extractedFile, move.destinationDirectory, copy );
			continue;
		}

		const specialDestination = path.join(
			move.destinationDirectory,
			path.basename( extractedFile )
		);

		if ( ! fs.existsSync( specialDestination ) ) {
			fs.mkdirSync( specialDestination );
		}

		const dirFiles = fs.readdirSync( extractedFile );

		for ( const file of dirFiles ) {
			if ( ! move.excludeSubdirs.has( file ) ) {
				await forceMove(
					path.join( extractedFile, file ),
					specialDestination,
					copy
				);
			}
		}
	}
}

/**
 * Moves source file or directory to destination. Destination must be a directory.
 */
async function forceMove( source, destination, copy = false ) {
	const stat = fs.statSync( destination );
	const destinationName = path.join( destination, path.basename( source ) );

	if ( ! stat.isDirectory() ) {
		throw new Error( 'Destination must be a directory.' );
	}

	if ( fs.existsSync( destinationName ) ) {
		await rm( destinationName, { recursive: true } );
	}

	if ( copy ) {
		await cp( source, destinationName, { recursive: true } );
	} else {
		fs.renameSync( source, destinationName );
	}
}

/**
 * Creates a temporary file, writes data to it, and returns its path. Caller is
 * responsible for removing the file.
 *
 * @param {string} data Data to write to file.
 * @return {Object} Object with properties filePath and dirPath.
 */
function writeTempFile( data ) {
	const dirPath = fs.mkdtempSync( `${ os.tmpdir() }${ path.sep }` );
	const filePath = path.join( dirPath, 'file' );
	fs.writeFileSync( filePath, data );
	return { filePath, dirPath };
}

module.exports = {
	writeTempFile,
	moveFiles,
	forceMove,
};
