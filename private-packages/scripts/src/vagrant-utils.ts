import 'reflect-metadata';
import { injectable } from 'inversify';
import { execSync } from 'child_process';
import path from 'path';

import { changeCwdToProjectRoot, withKeepingCwd, inVagrantDir } from './util';
import { machineNames } from './constants';

type SnapshotName = string;
type Snapshots = { [ machineName: string ]: SnapshotName[] };

@injectable()
export default class VagrantUtils {
	initialize() {
		changeCwdToProjectRoot();
		execSync( 'vagrant up', { stdio: 'inherit' } );
		this.createSnapshotOnInitialInstall();
	}

	createSnapshotOnInitialInstall() {
		const snapshotName = 'initial-install';
		const snapshotsList = execSync(
			'vagrant snapshot list --machine-readable'
		);
		const snapshots = this.getVagrantSnapshots( snapshotsList.toString() );
		const everyMachineContainsInitialSnapshot = machineNames.every(
			( machine ) =>
				snapshots[ machine ] &&
				snapshots[ machine ].includes( snapshotName )
		);
		if ( ! everyMachineContainsInitialSnapshot ) {
			execSync( `vagrant snapshot save --force ${ snapshotName }`, {
				stdio: 'inherit',
			} );
		}
	}

	/**
	 * @param snapshotsList vagrant snapshot list --machine-readable
	 */
	getVagrantSnapshots( snapshotsList: string ): Snapshots {
		let currentMachine = '';
		const initialValue: Snapshots = machineNames.reduce(
			( acc, val ) => ( { ...acc, [ val ]: [] } ),
			{}
		);
		const snapshots: Snapshots = snapshotsList
			.split( '\n' )
			.map( ( line ) => line.split( ',' ) )
			.filter( ( fields: string[] ) => fields.length > 0 )
			.map( ( fields: string[] ) =>
				fields.map( ( field: string ) => field.trim() )
			)
			.reduce( ( acc, fields ) => {
				const MACHINE_NAME_FIELD_INDEX = 4;
				const SNAPSHOT_NAME_FIELD_INDEX = 4;
				const machineRegex: {
					[ machineName: string ]: RegExp;
				} = machineNames.reduce(
					( acc, val ) => ( {
						...acc,
						[ val ]: new RegExp( `${ val }:$` ),
					} ),
					{}
				);

				// Did the output of snapshots for a new machine start? If so,
				// save machine name to currentMachine
				if ( fields[ MACHINE_NAME_FIELD_INDEX ] ) {
					const field = fields[ MACHINE_NAME_FIELD_INDEX ];
					const matchingMachineIndex = Object.entries(
						machineRegex
					).findIndex( ( [ name, regex ] ) => regex.test( field ) );
					if ( matchingMachineIndex !== -1 ) {
						// This field defines the start of output of snapshots
						// for a new machine. Remember that and return.
						currentMachine = Object.entries( machineRegex )[
							matchingMachineIndex
						][ 0 ];
						return acc;
					}
				}

				if ( currentMachine && fields[ SNAPSHOT_NAME_FIELD_INDEX ] ) {
					return {
						...acc,
						[ currentMachine ]: [
							...acc[ currentMachine ],
							fields[ SNAPSHOT_NAME_FIELD_INDEX ],
						],
					};
				}

				return acc;
			}, initialValue );
		return snapshots;
	}
}
