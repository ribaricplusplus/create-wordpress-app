import 'reflect-metadata';
import { injectable } from 'inversify';
import { mkdir, readFile, writeFile, cp } from 'fs/promises';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import glob from 'fast-glob';
import Handlebars from 'handlebars';
import { pascalCaseTransformMerge, pascalCase } from 'pascal-case';
import { snakeCase, upperCase, kebabCase, startCase } from 'lodash';

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

		const view: any = {
			name,
			pascalCaseName: pascalCase( name, {
				transform: pascalCaseTransformMerge,
			} ),
			upperCaseSnakeName: upperCase( snakeCase( name ) ).replaceAll(
				' ',
				'_'
			),
			displayName: startCase( name ),
			prefix: kebabCase( name ),
			description: 'WordPress project.',
			packageJson: {
				wpDev: process.env.CWAPP_TESTING_WPDEV_PATH ?? 'x',
			},
		};
		view.mainFileName = `${ view.upperCaseSnakeName }_FILE`;

		const hbFileRegex = /\.hb$/;

		// Install template files
		for ( const templateFile of templateFiles ) {
			const newFileName = ( () => {
				if ( hbFileRegex.test( templateFile ) ) {
					return templateFile.replace( hbFileRegex, '' );
				}

				return templateFile;
			} )();

			// Create directories if needed.
			if ( ! existsSync( path.dirname( templateFile ) ) ) {
				await mkdir( path.dirname( templateFile ), {
					recursive: true,
				} );
			}

			if ( hbFileRegex.test( templateFile ) ) {
				const contents = await readFile(
					path.join( templateRoot, templateFile ),
					{ encoding: 'utf8' }
				);
				const rendered = Handlebars.compile( contents )( view );
				await writeFile(
					path.resolve( `./${ newFileName }` ),
					rendered
				);
			} else {
				const destination = path.resolve( templateFile );
				const source = path.join( templateRoot, templateFile );
				await cp( source, destination );
			}
		}

		// Run commands - this should be parallelized in the future.
		execSync( 'npm install', { stdio: 'inherit' } );
		execSync( 'composer install', { stdio: 'inherit' } );
	}
}
