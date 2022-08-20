import type { Plugin } from 'vite';

import { choose_port } from '../utils/';

export default function dev_server_config(): Plugin {
	return {
		apply: 'serve',
		name: 'hm-dev-server',

		async config( config ) {
			const { server = {} } = config;
			let { host = 'localhost', port = 5173, ...rest_server } = server;

			// We need actual host name or IP address for choose_port() to work.
			if ( typeof host === 'boolean' ) {
				host = '0.0.0.0';
			}

			// Ensure chosen port is available because we need to enable strictPort below.
			// If the chosen port is already in use, a free one will be selected.
			port = await choose_port( { host, port } );
			const origin = `http://${ host }:${ port }`;

			return {
				...config,
				server: {
					...rest_server,
					host,
					origin,
					port,
					strictPort: true,
					hmr: {
						port,
						host,
						protocol: 'ws',
					},
				},
			};
		},
	};
}
