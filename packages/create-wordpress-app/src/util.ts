import { pascalCaseTransformMerge, pascalCase } from 'pascal-case';
import { snakeCase, upperCase, kebabCase, startCase } from 'lodash';
import Handlebars from 'handlebars';
import { cp, mkdir, writeFile, readFile } from 'fs/promises'
import { existsSync } from 'fs';
import path from 'path'

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

interface GetCommonViewOptions {
	name: string
}

export function getCommonView( options: GetCommonViewOptions ): any {
	const { name } = options;
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
	}
	view.mainFileName = `${ view.upperCaseSnakeName }_FILE`;
	return view
}

interface CopyOrRenderOptions {
	view: any
	templateFiles: string[]
	templateRoot: string
}

export async function copyOrRender( options: CopyOrRenderOptions ) {
	const { templateFiles, templateRoot, view } = options;
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
}
