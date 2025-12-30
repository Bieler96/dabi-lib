import type { Context } from 'hono';

export const GET = (c: Context) => {
    return c.json({
        message: 'Hello from the API!',
        timestamp: new Date().toISOString()
    });
};