# dabi-lib

`dabi-lib` ist eine meinungsstarke Fullstack-Library für React-Anwendungen, die eine nahtlose Integration von Frontend, Backend und Datenbank bietet. Sie ist darauf ausgelegt, schnell moderne Webanwendungen zu entwickeln.

## Features

- **Frontend**: React 19, Vite, TailwindCSS (v4), Lucide Icons.
- **Backend**: API Routes integriert via `Hono` (Server-Side).
- **Datenbank**: SQLite via `drizzle-orm` und `better-sqlite3`.
- **Router**: Eingebauter datei-basierter API-Router und client-seitiger Router mit Guards.
- **UI Komponenten**: Fertige Komponenten wie DataTables, Sheets, Cards, etc.

## Authentifizierung

`dabi-lib` bietet flexible Authentifizierungsoptionen für Ihre API-Endpunkte. Dazu gehören:
- **API-Key-basierte Authentifizierung**: Einfache und effektive Methode zur Absicherung von Endpunkten.
- **JWT (JSON Web Token) Authentifizierung**: Robuste, standardbasierte Authentifizierung für zustandslose APIs.

Weitere Details und Beispiele finden Sie in den Dateien `API_AUTH.md` und `JWT_EXAMPLE.md`.

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

## Installation via NPM

Du kannst die Library direkt in dein Projekt einbinden:

```bash
npm install dabi-lib
```

### Setup

1. **CSS importieren**:
   Importiere das CSS in deiner Haupteinstiegsdatei (z.B. `main.tsx`):
   ```tsx
   import 'dabi-lib/style.css';
   ```

2. **Tailwind Konfiguration**:
   Da die Library Tailwind CSS nutzt, stelle sicher, dass dein Projekt Tailwind v4 unterstützt.

### Komponenten nutzen

```tsx
import { Button, DataTable, Card } from 'dabi-lib';

function App() {
  return (
    <Card>
      <Button onClick={() => alert('Hello!')}>Klick mich</Button>
    </Card>
  );
}
```

## Projekt-CLI

`dabi-lib` kommt mit einem CLI-Tool, um Projekte schnell zu initialisieren oder Komponenten zu generieren.

```bash
npx dabi init mein-projekt
cd mein-projekt
npx dabi generate screen Dashboard
```

## Projektstruktur

- `src/api`: Backend API Endpunkte.
- `src/components`: Wiederverwendbare UI-Komponenten.
- `src/core`: Kern-Logik wie Router.
- `src/db`: Datenbank-Konfiguration und Schema.
- `src/screens`: Seiten/Screens der App.
