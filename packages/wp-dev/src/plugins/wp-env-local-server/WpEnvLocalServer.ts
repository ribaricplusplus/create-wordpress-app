import 'reflect-metadata';
import { injectable } from 'inversify';

import type LocalServer from '../../interfaces/local-server';

@injectable()
export default class WpEnvLocalServer implements LocalServer {
	start() {
		// TODO
	}
}
