import type { Context } from 'hono';
import type { AuthConfig } from '../api.js';

// Configure authentication for this route
export const auth: AuthConfig = {
    bearer: ['my-secret-token', 'another-valid-token'],
    // apiKey: ['my-api-key'], // You can also use API keys
};

export const GET = async (c: Context) => {
    return c.json({
        message: 'This is a protected endpoint!',
        timestamp: new Date().toISOString()
    });
};

export const POST = async (c: Context) => {
    const body = await c.req.json();
    return c.json({
        message: 'Protected POST endpoint',
        received: body,
        timestamp: new Date().toISOString()
    });
};
