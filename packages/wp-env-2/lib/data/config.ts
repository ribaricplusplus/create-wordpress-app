import { WpEnvConfig } from '../types';
import path from 'path';

let config: WpEnvConfig = {};

export function getConfig() {
	return config;
}

export function setConfig( _config: WpEnvConfig ) {
	config = _config;
}

export function getCustomFilesPath(): string {
	return path.join( config.configDirectoryPath, '.wpenv' );
}

export function getCustomPhpConfigPath(): string {
	return path.join( getCustomFilesPath(), '100-php-custom.ini' );
}

export function getXdebugDataPath(): string {
	return path.join( config.configDirectoryPath, '.xdebug' );
}
