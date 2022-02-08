import { WpDevConfiguration } from '../../../types'

export default interface config extends WpDevConfiguration {
	ssh: {
		host: string,
		privateKeyPath?: string
	}
}
