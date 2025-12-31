import type { Context } from 'hono';
import type { AuthConfig } from '../server/auth.js';

// Configure both Bearer and API Key authentication (OR logic)
export const auth: AuthConfig = {
    bearer: ['bearer-token-123'],
    apiKey: ['api-key-456']
};

export const GET = async (c: Context) => {
    return c.json({
        message: 'This endpoint accepts both Bearer token OR API Key!',
        timestamp: new Date().toISOString()
    });
};
