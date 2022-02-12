export interface CommanderOptions {
	// Nothing here
}

interface RunTestsOptions extends CommanderOptions {
	noSuspend: boolean;
	suspend: boolean;
	extraJestArguments: string;
	debugTests: boolean;
}

export interface RunIntegrationTestsOptions extends RunTestsOptions {}

export interface RunE2eTestsOptions extends RunTestsOptions {}
