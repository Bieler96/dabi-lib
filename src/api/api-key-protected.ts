import type { Context } from 'hono';
import type { AuthConfig } from '../server/auth.js';

// Configure API Key authentication
export const auth: AuthConfig = {
    apiKey: ['test-api-key', 'another-valid-key']
};

export const GET = async (c: Context) => {
    return c.json({
        message: 'This endpoint is protected with API Key!',
        timestamp: new Date().toISOString()
    });
};
