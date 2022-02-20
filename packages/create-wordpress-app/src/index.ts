import { program } from 'commander';

import { ProgramOptions } from './types';
import { container } from './container';
import type InitController from './init-controller';

export const VERSION = '0.1.1';

export async function cli() {
	program.version( VERSION );

	program
		.argument( '[name]', 'Directory name in which to initialize project.' )
		.option( '--template <template>', 'Project template to use.', 'theme' )
		.action( async ( name, options: Partial< ProgramOptions > ) => {
			const _options = {
				...options,
				name,
			} as ProgramOptions;
			const initController = container.get< InitController >(
				Symbol.for( 'InitController' )
			);
			initController.run( _options );
		} );

	await program.parseAsync();
}
