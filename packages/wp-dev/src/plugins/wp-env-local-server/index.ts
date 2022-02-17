import { addFilter } from '@wordpress/hooks';

import { provides } from './provides';

const init = () => {
	addFilter(
		'wp-dev-service-definitions',
		'wp-dev/plugins/wp-env-local-server/add-service-definitions',
		( definitions ) => {
			return { ...definitions, ...provides };
		}
	);
};

export const pluginConfig = {
	init,
};
