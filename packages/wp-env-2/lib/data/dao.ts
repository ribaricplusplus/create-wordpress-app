import sqlite3 from 'sqlite3';
import { existsSync } from 'fs';
import { mkdir, rm } from 'fs/promises';
import path from 'path';

import { WpEnvConfig } from '../types';

export default class DAO {
	private static _instance: DAO | null = null;

	private db: any;

	private dbPath: string | null = null;

	public getDbPath() {
		return this.dbPath;
	}

	public static getInstance(): DAO {
		if ( ! DAO._instance ) {
			DAO._instance = new DAO();
		}

		return DAO._instance;
	}

	public async init( { configDirectoryPath }: WpEnvConfig ) {
		const wpenvDataPath = path.join( configDirectoryPath, '.wpenv' );

		if ( ! existsSync( wpenvDataPath ) ) {
			await mkdir( wpenvDataPath );
		}

		this.db = await new Promise( ( resolve, reject ) => {
			this.dbPath = path.join( wpenvDataPath, 'db.sql' );

			const db = new sqlite3.Database( this.dbPath, ( err ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( db );
				}
			} );
		} );
	}

	public close() {
		return new Promise< void >( ( resolve, reject ) => {
			this.db.close( ( err ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve();
				}
			} );
		} );
	}

	public async destroy() {
		if ( ! this.dbPath ) {
			return;
		}

		await this.close();
		await rm( this.dbPath );
	}

	public run( sql: string, params?: any[] ) {
		return new Promise< void >( ( resolve, reject ) => {
			this.db.run( sql, params, function ( err ) {
				if ( err ) {
					reject( err );
				} else {
					resolve();
				}
			} );
		} );
	}

	public all( sql: string, params?: any[] ) {
		return new Promise( ( resolve, reject ) => {
			this.db.all( sql, params, ( err, rows ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( rows );
				}
			} );
		} );
	}

	private constructor() {}
}
