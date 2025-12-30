import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const products = sqliteTable('products', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
});
