import { execSync } from 'child_process'

import { InitTemplateOptions } from '../types'
import { getCommonView, copyOrRender } from '../util'

export async function initTemplate( options: InitTemplateOptions ) {
	const { templateFiles, templateRoot } = options;

	const view = getCommonView( options );

	await copyOrRender({ view, templateFiles, templateRoot })

	// Run commands - this should be parallelized in the future.
	execSync( 'npm install', { stdio: 'inherit' } );
	execSync( 'composer install', { stdio: 'inherit' } );
	execSync( 'git init -b main', { stdio: 'inherit' } );
}
