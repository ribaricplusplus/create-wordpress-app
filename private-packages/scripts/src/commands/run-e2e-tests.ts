import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { execSync } from 'child_process';

import { withVagrant } from '../util';
import { RunE2eTestsOptions } from '../types';
import type VagrantUtils from '../vagrant-utils';

@injectable()
export default class RunE2eTests {
	public vagrant;

	constructor(
		@inject( Symbol.for( 'VagrantUtils' ) ) vagrant: VagrantUtils
	) {
		this.vagrant = vagrant;
	}

	async run( options: RunE2eTestsOptions ) {
		await withVagrant(
			this.vagrant,
			() => {
				try {
					const nodeArguments = options.debugTests
						? `--inspect-brk=localhost:9222`
						: '';
					execSync(
						`node ${ nodeArguments } ./node_modules/.bin/jest --testTimeout=${
							600 * 1e3
						} --runInBand --selectProjects e2e-tests ${
							options.extraJestArguments
						}`,
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
}
