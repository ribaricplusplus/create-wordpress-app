import 'reflect-metadata';
import { Container } from 'inversify';

import InitController from './init-controller';

export const container = new Container( { defaultScope: 'Singleton' } );

container
	.bind< InitController >( Symbol.for( 'InitController' ) )
	.to( InitController );
