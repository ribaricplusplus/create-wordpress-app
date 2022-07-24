import path from 'path';
import os from 'os';
import Joi from 'joi';

import SshConfig from './interfaces/ssh-config';
import { WpDevConfiguration } from '../../types';
import Config from './interfaces/config';

export function extendConfig( config: WpDevConfiguration ): Config {
	const defaults: {
		ssh: Partial< SshConfig >;
		wordPressPath: string;
	} = {
		wordPressPath: '/var/www/html',
		ssh: {
			privateKeyPath: path.join( os.homedir(), '.ssh/id_ecdsa' ),
			port: 22,
		},
	};

	const extendedConfig = {
		...defaults,
		...config,
		ssh: {
			...defaults.ssh,
			...config?.ssh,
		},
	};

	const schema = Joi.object( {
		wordPressPath: Joi.string().min( 1 ).required(),
		ssh: Joi.object( {
			host: Joi.string().min( 1 ).required(),
			port: Joi.number().min( 1 ).integer().required(),
			username: Joi.string().min( 1 ).required(),
			privateKeyPath: Joi.string().min( 1 ).required(),
		} ).required(),
	} ).unknown( true );

	Joi.assert( extendedConfig, schema );

	return extendedConfig as Config;
}
