import 'reflect-metadata';
import { injectable } from 'inversify';
import { Client } from 'ssh2';
import { readFile } from 'fs/promises';
import { nanoid } from 'nanoid';
import type { SFTP } from 'ssh2';

import Config from './interfaces/config';
import IRemoteServer from '../../interfaces/remote-server';

@injectable()
export default class RemoteServer implements IRemoteServer {
	public client: Client;

	public isConnected: boolean = false;

	constructor() {
		this.client = new Client();

		this.client.on( 'error', ( err ) => {
			console.error( 'SSH client error occurred.' );
			console.error( err );
		} );

		this.client.on( 'end', () => {
			this.isConnected = false;
		} );
	}

	/**
	 * @throws If connection fails.
	 */
	async connect( { ssh }: Config ): Promise< void > {
		const privateKey = await readFile( ssh.privateKeyPath, {
			encoding: 'utf8',
		} );

		this.client.connect( {
			host: ssh.host,
			port: ssh.port,
			username: ssh.username,
			privateKey,
		} );

		return new Promise( ( resolve, reject ) => {
			this.client.once( 'ready', () => {
				this.isConnected = true;
				resolve();
			} );
		} );
	}

	async disconnect() {
		if ( ! this.isConnected || ! this.client ) {
			return;
		}

		this.client.end();

		return new Promise< void >( ( resolve, reject ) => {
			this.client.once( 'end', () => {
				this.isConnected = false;
				resolve();
			} );
		} );
	}

	async execScript( script, _options ) {
		const defaultOptions = {
			logOutput: false,
		};

		const options = {
			...defaultOptions,
			..._options,
		};

		if ( ! this.isConnected || ! this.client ) {
			throw new Error(
				'Cannot execute scripts when a connection is not established.'
			);
		}

		const sftp = await this.getSftp();

		// Write file somewhere in remote server /tmp directory
		const remoteScriptName = `create-wordpress-app-script-${ nanoid() }.sh`;
		const remoteScriptPath = `/tmp/${ remoteScriptName }`;
		let result;

		try {
			const writeStream = sftp.createWriteStream( remoteScriptPath, {
				mode: 0o776,
				encoding: 'utf8',
			} );
			writeStream.end( script );
			await new Promise( ( resolve, reject ) => {
				writeStream.once( 'error', reject );
				writeStream.once( 'finish', resolve );
			} );
			result = await new Promise( ( resolve, reject ) => {
				this.client.exec( remoteScriptPath, ( err, stream ) => {
					if ( err ) {
						reject( err );
						return;
					}

					let allOutput = '';
					const handleData = ( data ) => {
						if ( options.logOutput ) {
							console.log( data.toString() );
						}
						allOutput += data.toString();
					};
					stream.stdout.on( 'data', handleData );
					stream.stderr.on( 'data', handleData );
					stream.on( 'close', ( code ) => {
						resolve( { output: allOutput, code } );
					} );
					stream.on( 'error', reject );
				} );
			} );
		} finally {
			await new Promise< void >( ( resolve, reject ) => {
				sftp.unlink( remoteScriptPath, ( err ) => {
					if ( err ) {
						reject( err );
						return;
					}
					resolve();
				} );
			} );
		}

		return result;
	}

	async download( source, destination ) {
		const sftp = await this.getSftp();
		await new Promise< void >( ( resolve, reject ) => {
			sftp.fastGet( source, destination, ( err ) => {
				if ( err ) {
					reject( err );
					return;
				}
				resolve();
			} );
		} );
	}

	private getSftp(): Promise< SFTP > {
		if ( ! this.isConnected ) {
			throw new Error(
				'Cannot get SFTP client when not connected to a remote server.'
			);
		}

		return new Promise( ( resolve, reject ) => {
			this.client.sftp( ( err, sftp ) => {
				if ( err ) {
					reject( err );
					return;
				}

				resolve( sftp );
			} );
		} );
	}
}
