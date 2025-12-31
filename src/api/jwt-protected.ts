import type { Context } from 'hono';
import type { AuthConfig } from '../api.js';

// Configure JWT authentication
export const auth: AuthConfig = {
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        algorithms: ['HS256'],
        // Optional: Add custom verification logic
        verify: async (payload: any) => {
            // Example: Check if user role is valid
            if (payload.role && ['admin', 'user', 'guest'].includes(payload.role)) {
                return true;
            }
            return false;
        }
    }
};

export const GET = async (c: Context) => {
    // Access the JWT payload that was stored in the context
    const jwtPayload = c.get('jwtPayload');

    return c.json({
        message: 'This endpoint is protected with JWT!',
        user: jwtPayload,
        timestamp: new Date().toISOString()
    });
};

export const POST = async (c: Context) => {
    const jwtPayload = c.get('jwtPayload');
    const body = await c.req.json();

    return c.json({
        message: 'Protected POST endpoint with JWT',
        user: jwtPayload,
        received: body,
        timestamp: new Date().toISOString()
    });
};
