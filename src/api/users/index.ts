import type { Context } from 'hono';
import { db } from '../../db';
import { users } from '../../db/schema';
import { count, eq, and, like, lte, gte } from 'drizzle-orm';

export const GET = async (c: Context) => {
    try {
        const page = Number(c.req.query('page')) || 1;
        const limit = Number(c.req.query('limit')) || 10;
        const offset = (page - 1) * limit;

        // Filters
        const search = c.req.query('search');
        const email = c.req.query('email');
        const createdAtAt = c.req.query('createdAtAt');
        const createdAtBefore = c.req.query('createdAtBefore');
        const createdAtAfter = c.req.query('createdAtAfter');

        const filters = [];

        if (search) {
            filters.push(like(users.name, `%${search}%`));
        }
        if (email) {
            filters.push(like(users.email, `%${email}%`));
        }
        if (createdAtAt) {
            filters.push(eq(users.createdAt, new Date(createdAtAt)));
        }
        if (createdAtBefore) {
            filters.push(lte(users.createdAt, new Date(createdAtBefore)));
        }
        if (createdAtAfter) {
            filters.push(gte(users.createdAt, new Date(createdAtAfter)));
        }

        const whereClause = filters.length > 0 ? and(...filters) : undefined;

        const allUsers = await db.select().from(users)
            .where(whereClause)
            .limit(limit)
            .offset(offset)
            .all();

        const totalResult = await db.select({ value: count() })
            .from(users)
            .where(whereClause)
            .all();

        const totalCount = totalResult[0]?.value ?? 0;

        return c.json({
            data: allUsers,
            metadata: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
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

export const DELETE = async (c: Context) => {
    try {
        const id = Number(c.req.param('id'));
        if (!id) return c.json({ error: 'Valid ID required' }, 400);

        await db.delete(users).where(eq(users.id, id));
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
};

export const PATCH = async (c: Context) => {
    try {
        const id = Number(c.req.param('id'));
        if (!id) return c.json({ error: 'Valid ID required' }, 400);

        const body = await c.req.json();
        const { name, email } = body;

        const updatedUser = await db.update(users)
            .set({
                ...(name && { name }),
                ...(email && { email })
            })
            .where(eq(users.id, id))
            .returning();

        return c.json(updatedUser[0]);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
};
