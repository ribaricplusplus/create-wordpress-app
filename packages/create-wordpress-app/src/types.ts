export interface ProgramOptions {
	template: string;
	name?: string;
}

export interface InitTemplateOptions {
	templateFiles: string[]

	// Directory name where the project will be initialized
	name: string

	// Path to root folder where template files are located
	templateRoot: string
}
