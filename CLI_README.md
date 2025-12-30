# Dabi CLI 🚀

Die **Dabi CLI** ist das Werkzeug zur Unterstützung der Entwicklung mit der `dabi-lib`. Sie ermöglicht es dir, blitzschnell neue Projekte zu initialisieren und zentrale Ressourcen wie Screens, API-Endpoints und Datenbank-Schemas zu generieren.

## Installation

Da die CLI Teil des `dabi-lib` Pakets ist, kannst du sie direkt über `npx` ausführen:

```bash
# Projekt initialisieren
npx dabi init <projekt-name>
```

## Befehle

### 1. Initialisierung (`init`)
Erstellt ein neues Projekt basierend auf dem `dabi-lib` Template.

```bash
npx dabi init my-awesome-app
```
*Kopiert alle notwendigen Dateien, konfiguriert die Struktur und bereitet alles für `npm install` vor.*

---

### 2. Generierung (`generate` oder `g`)
Erstellt neue Komponenten und integriert sie (wo möglich) automatisch in deine App.

#### Screens (Seiten)
Erstellt eine neue Screen-Komponente und registriert sie im Router (`src/App.tsx`).

```bash
npx dabi g screen Shop
# oder kurz
npx dabi g s Shop
```

#### API Endpoints
Erstellt eine neue API-Route für das file-based Routing.

```bash
npx dabi g api orders
# oder kurz
npx dabi g a orders
```
*Generiert eine Datei in `src/api/orders.ts` mit GET und POST Handlern.*

#### Datenbank Schemas
Fügt eine neue Tabelle zu deinem Drizzle-Schema hinzu.

```bash
npx dabi g db products
# oder kurz
npx dabi g d products
```
*Ergänzt `src/db/schema.ts` um die neue Tabelle. Vergiss nicht danach `npm run db:push` auszuführen!*

---

## Projektstruktur

Wenn du Ressourcen generierst, folgt die CLI dieser Struktur:
- **Screens:** `src/screens/*.tsx`
- **API:** `src/api/*.ts`
- **DB:** `src/db/schema.ts`

## Voraussetzungen
- Node.js (v18+)
- `tsx` (wird automatisch mit `npx` verwendet)
