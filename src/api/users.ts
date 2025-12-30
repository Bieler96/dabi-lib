import type { Context } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';

export const GET = async (c: Context) => {
    try {
        const allUsers = await db.select().from(users).all();
        return c.json(allUsers);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
};

export const POST = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { name, email } = body;

        if (!name || !email) {
            return c.json({ error: 'Name and email are required' }, 400);
        }

        const newUser = await db.insert(users).values({
            name,
            email,
            createdAt: new Date(),
        }).returning();

        return c.json(newUser[0], 201);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
};
