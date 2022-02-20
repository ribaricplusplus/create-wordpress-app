import 'reflect-metadata';
import { injectable } from 'inversify';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises'
import path from 'path';
import glob from 'fast-glob';

import { ProgramOptions } from './types';
import { inDirectory } from './util';

@injectable()
export default class InitController {
	async run( options: ProgramOptions ) {
		if ( options.name ) {
			const projectPath = path.resolve( `./${ options.name }` );
			if ( ! existsSync( projectPath ) ) {
				await mkdir( projectPath );
			}

			process.chdir( projectPath );
		}

		const templatesRoot = path.join( __dirname, '../templates' );

		const templateRoot = path.join( templatesRoot, options.template );

		if ( ! existsSync( templateRoot ) ) {
			throw new Error( `Template ${ options.template } not found.` );
		}

		let templateFiles: string[] = [];

		await inDirectory( templateRoot, () => {
			templateFiles = glob.sync( [ '**/*' ], {
				dot: true,
				onlyFiles: true,
			} );
		} );

		const name = options.name ?? path.dirname( process.cwd() );

		const { initTemplate } = await import('./templates/theme')

		await initTemplate( {
			templateFiles,
			name,
			templateRoot
		} )

	}
}
