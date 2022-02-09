export default interface WPSource {
	// The source type.
	type: 'local' | 'git' | 'zip';

	// The path to the WordPress installation, plugin or theme.
	path: string;

	// Name that identifies the WordPress installation, plugin or theme.
	basename: string;

	// The URL to the source download if the source type is not local.
	url?: string;

	// The git ref for the source if the source type is 'git'.
	ref?: string;
}
