import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { execSync } from 'child_process';

import { changeCwdToProjectRoot, withVagrant } from '../util';
import { RunIntegrationTestsOptions } from '../types';
import type VagrantUtils from '../vagrant-utils';

@injectable()
export default class RunIntegrationTests {
	public vagrant;

	constructor(
		@inject( Symbol.for( 'VagrantUtils' ) ) vagrant: VagrantUtils
	) {
		this.vagrant = vagrant;
	}

	async run( options: RunIntegrationTestsOptions ) {
		await withVagrant(
			this.vagrant,
			() => {
				const jestArguments = `--runInBand --selectProjects integration-tests ${ options.extraJestArguments }`;
				const nodeArguments = options.debugTests
					? `CWAPP_NODE_ARGUMENTS="--inspect-brk=0.0.0.0:9229"`
					: '';
				try {
					execSync(
						`vagrant ssh client -c 'CWAPP_JEST_ARGUMENTS="${ jestArguments }" ${ nodeArguments } /vagrant/private-packages/scripts/src/sh/run-integration-tests.sh'`,
						{ stdio: 'inherit' }
					);
				} catch ( e ) {
					console.error(
						'Test command exited with non-zero status.'
					);
				}
			},
			options
		);
	}

	/**
	 * TODO: This should be removed.
	 */
	createSnapshotOnInitialInstall() {
		return this.vagrant.createSnapshotOnInitialInstall();
	}

	/**
	 * TODO: This should be removed.
	 */
	getVagrantSnapshots( snapshotsList: string ) {
		return this.vagrant.getVagrantSnapshots( snapshotsList );
	}
}
