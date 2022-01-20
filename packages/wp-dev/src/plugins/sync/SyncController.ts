import 'reflect-metadata';
import { injectable, inject } from 'inversify';

import LocalServer from '../../interfaces/local-server';
import { dependsOn } from './depends-on';
import { WpDevConfiguration } from '../../types';

@injectable()
export default class SyncController {
	public localServer: LocalServer;

	constructor( @inject( dependsOn.LocalServer ) localServer: LocalServer ) {
		this.localServer = localServer;
	}

	run( config: WpDevConfiguration, options: object ) {
		console.log(
			'Running sync command with local server',
			this.localServer
		);
	}
}
