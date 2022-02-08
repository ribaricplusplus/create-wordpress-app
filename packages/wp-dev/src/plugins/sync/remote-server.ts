import 'reflect-metadata'
import { injectable } from 'inversify';
import IRemoteServer from '../../interfaces/remote-server'

@injectable()
export default class RemoteServer implements IRemoteServer {
	async connect() {

	}

	async execScript() {
		// TODO
	}
}
