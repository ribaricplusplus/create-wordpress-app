import { program } from 'commander';

import { container } from './container';
import type RunIntegrationTests from './commands/run-integration-tests';
import type RunE2eTests from './commands/run-e2e-tests';
import { RunIntegrationTestsOptions, RunE2eTestsOptions } from './types';

export const VERSION = '0.1.0';

function addRunTestsOptions( command: any ) {
	return command
		.option( '--no-suspend', 'Do not suspend vagrant machines.' )
		.option( '--debug-tests', 'Debug tests.', false )
		.option(
			'--extra-jest-arguments <args>',
			'Extra arguments to pass to jest',
			''
		);
}

export async function cli() {
	program.version( VERSION );

	addRunTestsOptions(
		program
			.command( 'run-integration-tests' )
			.description( 'Run integration tests.' )
			.action( async ( options: RunIntegrationTestsOptions ) => {
				const command = container.get< RunIntegrationTests >(
					Symbol.for( 'RunIntegrationTests' )
				);
				await command.run( options );
			} )
	);

	addRunTestsOptions(
		program
			.command( 'e2e-test' )
			.description( 'Run e2e tests.' )
			.action( async ( options: RunE2eTestsOptions ) => {
				const command = container.get< RunE2eTests >(
					Symbol.for( 'RunE2eTests' )
				);
				await command.run( options );
			} )
	);

	await program.parseAsync();
}
