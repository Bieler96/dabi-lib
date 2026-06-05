# dabi-lib

`dabi-lib` ist eine meinungsstarke UI-Library für React-Anwendungen. Sie ist darauf ausgelegt, schnell moderne Webanwendungen zu entwickeln.

## Features

- **Frontend**: React 19, Vite, TailwindCSS (v4), Lucide Icons.
- **Router**: TanStack Router Grundaufbau fuer neue Projekte.
- **UI Komponenten**: Fertige Komponenten wie DataTables, Sheets, Cards, etc.

## Installation & Setup

1. **Abhängigkeiten installieren:**

```bash
npm install
```

2. **Entwicklungsserver starten:**

Startet den Frontend-Entwicklungsserver.

```bash
npm run dev
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
	fetchUrl: "/orders.json",
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

- `src/components`: Wiederverwendbare UI-Komponenten.
- `src/router.tsx`: TanStack Router Setup.
- `src/screens`: Seiten/Screens der App.
