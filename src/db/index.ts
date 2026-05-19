import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

export function createDb(dbPath = process.env.DATABASE_URL || "sqlite.db") {
	const sqlite = new Database(dbPath);
	return drizzle(sqlite, { schema });
}

export const db = createDb();

export function initDb(path: string) {
	return createDb(path);
}
