import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { applyFilters } from '@wordpress/hooks';
import { execSync } from 'child_process'

import LocalServer from '../../interfaces/local-server';
import RemoteServer from '../../interfaces/remote-server';
import { dependsOn } from './depends-on';
import { WpDevConfiguration, CommandCommanderOptions } from '../../types';

@injectable()
export default class SyncController {
	public localServer: LocalServer;
	public remoteServer: RemoteServer

	constructor( @inject( dependsOn.LocalServer ) localServer: LocalServer, @inject( dependsOn.RemoteServer ) remoteServer: RemoteServer ) {
		this.localServer = localServer;
		this.remoteServer = remoteServer
	}

	async run( config: WpDevConfiguration, options: CommandCommanderOptions ) {
		await this.remoteServer.connect( config.ssh ?? {} )
		const missingDependencies = await this.getMissingSystemAndServerDependencies();

		if ( missingDependencies.length > 0 ) {
			for( const dependency of missingDependencies ) {
				console.error( `Error: Missing ${ dependency.type } dependency: ${ dependency.name }` );
			}
			return;
		};

		if ( ! ( await this.localServer.isStarted() ) ) {
			// We're not starting the server because we don't know what
			// parameters a user would want to start a server with... Maybe they
			// want it to start with --xdebug, for example.
			console.error( 'Local server not started. Please start it first so that synchronization can complete.' )
			return;
		}

		const downloadFilesFromServer = applyFilters( 'wp-dev-plugin-sync-download-callback', this.downloadFilesFromServer.bind ) as Function;
		await downloadFilesFromServer();

		await this.importFiles();
		await this.importDatabase();
	}

	async getMissingSystemAndServerDependencies(): Promise<Array<{ type: 'system' | 'server', name: string}>>  {

	}

	async downloadFilesFromServer() {
		const remoteExecCb = () => {
			// TODO
			execSync( 'ssh' )
			// Check whether someone else is currently doing a sync... Only 1 sync allowed at a time.
		}
		// TODO: Connect through ssh and proceed
	}

	async importFiles() {
		// TODO import files that were downloaded from server
	}

	async importDatabase() {
		// TODO import database that was download from server
	}
}
