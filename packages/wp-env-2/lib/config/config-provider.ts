class ConfigProvider {
	private _config: any = null;

	getConfig() {
		return this._config;
	}

	setConfig( config: any ) {
		this._config = config;
	}
}

module.exports = new ConfigProvider();
