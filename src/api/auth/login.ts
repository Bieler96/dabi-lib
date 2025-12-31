import type { Context } from 'hono';
import { generateJWT } from '../../api.js';

// This endpoint generates a JWT token for testing
export const POST = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { username, role } = body;

        if (!username) {
            return c.json({ error: 'Username is required' }, 400);
        }

        // Generate JWT with user data
        const token = generateJWT(
            {
                username,
                role: role || 'user',
                iat: Math.floor(Date.now() / 1000)
            },
            process.env.JWT_SECRET || 'your-secret-key',
            {
                expiresIn: '24h'
            }
        );

        return c.json({
            token,
            message: 'JWT token generated successfully',
            expiresIn: '24h'
        });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
};
