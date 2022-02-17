/*
 * Contains duplicated functionality from wp-dev utils. This should be extracted
 * into separate module.
 */

export async function withKeepingCwd( cb: Function ) {
	const cwd = process.cwd();
	try {
		await cb();
	} finally {
		process.chdir( cwd );
	}
}

export async function inDirectory( dir: string, cb: Function ) {
	await withKeepingCwd( async () => {
		process.chdir( dir );
		await cb();
	} );
}
