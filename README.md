# dabi-lib

`dabi-lib` ist eine meinungsstarke Fullstack-Library für React-Anwendungen, die eine nahtlose Integration von Frontend, Backend und Datenbank bietet. Sie ist darauf ausgelegt, schnell moderne Webanwendungen zu entwickeln.

## Features

- **Frontend**: React 19, Vite, TailwindCSS (v4), Lucide Icons.
- **Backend**: API Routes integriert via `Hono` (Server-Side).
- **Datenbank**: SQLite via `drizzle-orm` und `better-sqlite3`.
- **Router**: Eingebauter datei-basierter API-Router und client-seitiger Router mit Guards.
- **UI Komponenten**: Fertige Komponenten wie DataTables, Sheets, Cards, etc.

## Installation & Setup

1. **Abhängigkeiten installieren:**

```bash
npm install
```

2. **Datenbank initialisieren:**

Erstellt die lokale SQLite-Datenbank (`sqlite.db`) basierend auf dem Schema.

```bash
npm run db:push
```

3. **Entwicklungsserver starten:**

Startet das Frontend und die API-Endpunkte gleichzeitig.

```bash
npm run dev
```

## Datenbank Nutzung (Drizzle & SQLite)

Die Library nutzt [Drizzle ORM](https://orm.drizzle.team/) mit SQLite.

### Schema definieren

Erstelle oder bearbeite Tabellen in `src/db/schema.ts`:

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
});
```

### Datenbank Updates

Wenn du das Schema änderst, synchronisiere die Datenbank:

```bash
npm run db:push
```

Mit Drizzle Studio kannst du die Daten visuell verwalten:

```bash
npm run db:studio
```

### Datenbank Abfragen

Importiere `db` aus `src/db` um Queries auszuführen (nur in API Routes oder Server-Dateien verwenden!):

```typescript
import { db } from '../db';
import { users } from '../db/schema';

// Alle User laden
const allUsers = await db.select().from(users).all();

// User erstellen
await db.insert(users).values({
    name: "Max Mustermann",
    email: "max@example.com"
});
```

## API Routes

API Routes werden automatisch aus dem Ordner `src/api` geladen. Die Dateistruktur definiert die URL.

Beispiel: `src/api/users.ts` -> `/api/users`

```typescript
import type { Context } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';

export const GET = async (c: Context) => {
    const data = await db.select().from(users).all();
    return c.json(data);
};

export const POST = async (c: Context) => {
    const body = await c.req.json();
    // ... Logik
    return c.json({ success: true });
};
```

## Nutzung in anderen Projekten

Diese Library ist darauf ausgelegt, portabel zu sein.

- Setze `DATABASE_URL` als Umgebungsvariable, um den Pfad zur SQLite-Datenbank zu ändern.
- API-Routen und UI-Komponenten können direkt importiert und genutzt werden.

## Projektstruktur

- `src/api`: Backend API Endpunkte.
- `src/components`: Wiederverwendbare UI-Komponenten.
- `src/core`: Kern-Logik wie Router.
- `src/db`: Datenbank-Konfiguration und Schema.
- `src/screens`: Seiten/Screens der App.
