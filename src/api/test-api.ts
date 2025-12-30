import { Context } from 'hono';

export const GET = async (c: Context) => {
    return c.json({ message: 'Hello from test-api API!' });
};

export const POST = async (c: Context) => {
    const body = await c.req.json();
    return c.json({ 
        message: 'Data received',
        data: body 
    });
};
