import { WpDevConfiguration } from '../../../types';
import SshConfig from './ssh-config';

export default interface Config extends WpDevConfiguration {
	wordPressPath: string;
	ssh: SshConfig;
	transformPaths?: { [ oldPath: string ]: string };
}
