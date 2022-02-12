import path from 'path';
import { execSync } from 'child_process';

import { fromProjectRoot } from '@wordpress/scripts/utils';
import type VagrantUtils from './vagrant-utils';

// TODO: Some duplication in wp-dev/src/util. Use those functions.
export async function withKeepingCwd( cb: Function ) {
	const cwd = process.cwd();
	try {
		await cb();
	} catch ( e ) {
		process.chdir( cwd );
		throw e;
	}
}

export async function inVagrantDir( cb: Function ) {
	await withKeepingCwd( async () => {
		process.chdir( path.join( __dirname, 'vagrant' ) );
		await cb();
	} );
}

export function changeCwdToProjectRoot() {
	const projectRoot = fromProjectRoot( '/' );
	process.chdir( projectRoot );
}

type WithVagrantOptions = {
	suspend: boolean;
};

export async function withVagrant(
	vagrant: VagrantUtils,
	cb: Function,
	_options?: Partial< WithVagrantOptions >
) {
	const defaultOptions = {
		suspend: true,
	};
	const options: WithVagrantOptions = {
		...defaultOptions,
		..._options,
	};

	try {
		changeCwdToProjectRoot();
		await vagrant.initialize();
		await cb();
		if ( options.suspend ) {
			execSync( 'vagrant suspend', { stdio: 'inherit' } );
		}
	} finally {
		if ( options.suspend ) {
			execSync( 'vagrant suspend', { stdio: 'inherit' } );
		}
	}
}
