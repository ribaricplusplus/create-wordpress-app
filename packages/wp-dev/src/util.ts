import { fromProjectRoot } from '@wordpress/scripts/utils';

type Callback = ( ...args: any[] ) => any;

/**
 * Call cb, return false if an exception occurs
 */
export async function safeCall< T extends Callback >(
	cb: T,
	...args: any[]
): Promise< ReturnType< T > | false > {
	try {
		return await cb( ...args );
	} catch ( e ) {
		return false;
	}
}

export function getCachePath() {
	return fromProjectRoot( '.wp-dev-cache' );
}

export async function withKeepingCwd( cb: Function ) {
	const cwd = process.cwd();
	try {
		await cb();
	} finally {
		process.chdir( cwd );
	}
}

export function changeCwdToProjectRoot() {
	const projectRoot = fromProjectRoot( '/' );
	process.chdir( projectRoot );
}

export async function inDirectory( dir: string, cb: Function ) {
	await withKeepingCwd( async () => {
		process.chdir( dir );
		await cb();
	} );
}

export async function inProjectRoot( cb: Function ) {
	await withKeepingCwd( async () => {
		changeCwdToProjectRoot();
		await cb();
	} );
}
