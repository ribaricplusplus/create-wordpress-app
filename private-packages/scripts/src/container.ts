import 'reflect-metadata';
import { Container } from 'inversify';

import RunIntegrationTests from './commands/run-integration-tests';
import RunE2eTests from './commands/run-e2e-tests';
import VagrantUtils from './vagrant-utils';

export const container = new Container( { defaultScope: 'Singleton' } );

container
	.bind< RunIntegrationTests >( Symbol.for( 'RunIntegrationTests' ) )
	.to( RunIntegrationTests );

container.bind< RunE2eTests >( Symbol.for( 'RunE2eTests' ) ).to( RunE2eTests );

container
	.bind< VagrantUtils >( Symbol.for( 'VagrantUtils' ) )
	.to( VagrantUtils );
