const readJsConfigFile = async ( configPath: string ): Promise<object> => {
	return await import( configPath );
}
