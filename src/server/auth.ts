import type { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

export interface JwtConfig {
	secret: string;
	algorithms?: jwt.Algorithm[];
	verify?: (payload: any) => boolean | Promise<boolean>;
}

export interface AuthConfig {
	bearer?: boolean | string | string[];
	apiKey?: boolean | string | string[];
	jwt?: JwtConfig;
}

export const apiKeyAuth = (options: { key: string | string[]; header?: string; query?: string }) => {
	return async (c: Context, next: Next) => {
		const headerName = options.header || 'x-api-key';
		const queryName = options.query || 'apiKey';

		const apiKey = c.req.header(headerName) || c.req.query(queryName);
		const keys = Array.isArray(options.key) ? options.key : [options.key];

		if (!apiKey || !keys.includes(apiKey)) {
			return c.json({ error: 'Unauthorized: Invalid API Key' }, 401);
		}
		await next();
	};
};

export const getAuthMiddleware = (config: AuthConfig) => {
	return async (c: Context, next: Next) => {
		let authenticated = false;
		let errors: string[] = [];

		// Check Bearer
		if (config.bearer) {
			const tokens = typeof config.bearer === 'string'
				? [config.bearer]
				: Array.isArray(config.bearer)
					? config.bearer
					: [process.env.DABI_BEARER_TOKEN || 'default-bearer-token'];

			const authHeader = c.req.header('Authorization');
			if (authHeader?.startsWith('Bearer ')) {
				const token = authHeader.substring(7);
				if (tokens.includes(token)) {
					authenticated = true;
				} else {
					errors.push('Invalid Bearer token');
				}
			} else {
				errors.push('Missing Bearer token');
			}
		}

		// Check JWT if not already authenticated
		if (!authenticated && config.jwt) {
			const authHeader = c.req.header('Authorization');
			if (authHeader?.startsWith('Bearer ')) {
				const token = authHeader.substring(7);
				try {
					const decoded = jwt.verify(token, config.jwt.secret, {
						algorithms: config.jwt.algorithms || ['HS256']
					});

					// Optional custom verification
					if (config.jwt.verify) {
						const isValid = await config.jwt.verify(decoded);
						if (isValid) {
							authenticated = true;
							// Store JWT payload in context for use in route handlers
							c.set('jwtPayload', decoded);
						} else {
							errors.push('JWT verification failed');
						}
					} else {
						authenticated = true;
						c.set('jwtPayload', decoded);
					}
				} catch (err: any) {
					errors.push(`Invalid JWT: ${err.message}`);
				}
			} else {
				errors.push('Missing JWT token');
			}
		}

		// Check API Key if not already authenticated
		if (!authenticated && config.apiKey) {
			const keys = typeof config.apiKey === 'string'
				? [config.apiKey]
				: Array.isArray(config.apiKey)
					? config.apiKey
					: [process.env.DABI_API_KEY || 'default-api-key'];

			const headerName = 'x-api-key';
			const queryName = 'apiKey';
			const apiKey = c.req.header(headerName) || c.req.query(queryName);

			if (apiKey && keys.includes(apiKey)) {
				authenticated = true;
			} else {
				errors.push('Invalid or missing API Key');
			}
		}

		// If no auth method was specified, allow through (though this middleware wouldn't be called)
		if (!config.bearer && !config.apiKey && !config.jwt) {
			return await next();
		}

		if (authenticated) {
			return await next();
		}

		return c.json({ error: 'Unauthorized', details: errors }, 401);
	};
};

// Helper function to generate JWT tokens
export const generateJWT = (payload: any, secret: string, options?: jwt.SignOptions): string => {
	return jwt.sign(payload, secret, {
		algorithm: 'HS256',
		expiresIn: '24h',
		...options
	});
};

// Helper function to decode JWT without verification (useful for debugging)
export const decodeJWT = (token: string): any => {
	return jwt.decode(token);
};