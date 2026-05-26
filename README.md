# dabi-lib

`dabi-lib` ist eine meinungsstarke Fullstack-Library für React-Anwendungen, die eine nahtlose Integration von Frontend und Backend bietet. Sie ist darauf ausgelegt, schnell moderne Webanwendungen zu entwickeln.

## Features

- **Frontend**: React 19, Vite, TailwindCSS (v4), Lucide Icons.
- **Backend**: API Routes integriert via `Hono` (Server-Side).
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

2. **Entwicklungsserver starten:**

Startet das Frontend und die API-Endpunkte gleichzeitig.

```bash
npm run dev
```

## API Routes

API Routes werden automatisch aus dem Ordner `src/api` geladen. Die Dateistruktur definiert die URL.

Beispiel: `src/api/users.ts` -> `/api/users`

```typescript
import type { Context } from "hono";

export const GET = async (c: Context) => {
	return c.json({ users: [] });
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
    import "dabi-lib/style.css";
    ```

2. **Tailwind Konfiguration**:
   Da die Library Tailwind CSS nutzt, stelle sicher, dass dein Projekt Tailwind v4 unterstützt.

### Komponenten nutzen

```tsx
import { Button, DataTable, Card } from "dabi-lib";

function App() {
	return (
		<Card>
			<Button onClick={() => alert("Hello!")}>Klick mich</Button>
		</Card>
	);
}
```

### Gen UI Widgets

Für widgetbasierte Oberflächen kannst du deklarative Gen-UI-Widgets in einem flexiblen Row-/Column-Grid nutzen. Unterstützt werden `stat-card`, `data-table`, `chart`, `map` und `form-builder`; Daten können direkt übergeben oder per `fetchUrl`/`fetcher` geladen werden.

```tsx
import { GenUIGrid, GenUIWidget } from "dabi-lib";

const revenueWidget = new GenUIWidget({
	id: "revenue",
	type: "stat-card",
	title: "Revenue",
	data: {
		label: "Revenue",
		value: "35.400 EUR",
		trend: { value: "+8.6%", direction: "up" },
	},
});

const liveTableWidget = new GenUIWidget({
	id: "orders",
	type: "data-table",
	title: "Orders",
	fetchUrl: "/api/orders",
	columns: [
		{ key: "id", header: "ID" },
		{ key: "customer", header: "Customer" },
		{ key: "total", header: "Total" },
	],
});

const contactWidget = new GenUIWidget({
	id: "contact",
	type: "form-builder",
	title: "Kontakt",
	fields: [
		{ name: "name", label: "Name", required: true },
		{ name: "email", type: "email", label: "Email", required: true },
	],
	submitLabel: "Senden",
	onSubmit: (values) => console.log(values),
});

function Dashboard() {
	return (
		<GenUIGrid
			rows={[
				{
					id: "overview",
					columns: [
						{ id: "stats", span: 4, widgets: [revenueWidget] },
						{ id: "orders", span: 8, widgets: [liveTableWidget] },
						{ id: "contact", span: 12, widgets: [contactWidget] },
					],
				},
			]}
		/>
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
- `src/screens`: Seiten/Screens der App.
