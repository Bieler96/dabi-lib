import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

let sqlite: Database.Database;

const dbPath = process.env.DATABASE_URL || 'sqlite.db';

try {
    sqlite = new Database(dbPath);
} catch (error) {
    console.warn(`Could not connect to ${dbPath}, proceeding without DB connection. Error:`, error);
    // Fallback or rethrow depending on how you want to handle it.
    // For a library, maybe we shouldn't force initialization immediately at the top level?
    // But for a running app, we need it.
}

// We can export a function to init/get the DB to be safe, or just export the instance.
// Exporting the instance is standard for simple apps.
// Ideally, the DB path should be configurable.
export const db = drizzle(sqlite!, { schema });

// Helper to initialize custom path if needed (for library usage)
export function initDb(path: string) {
    const customSqlite = new Database(path);
    return drizzle(customSqlite, { schema });
}
