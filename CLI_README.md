# Dabi CLI 🚀

Die **Dabi CLI** ist das Werkzeug zur Unterstützung der Entwicklung mit der `dabi-lib`. Sie ermöglicht es dir, blitzschnell neue Projekte zu initialisieren und Features oder Screens zu generieren.

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

_Kopiert alle notwendigen Dateien, konfiguriert die Struktur und bereitet alles für `npm install` vor._

---

### 2. Generierung (`generate` oder `g`)

Erstellt neue Features oder Screens und integriert Screens automatisch in den TanStack Router.

#### Features

Erstellt ein Feature-Grundgeruest unter `src/features/<feature>` mit Ordnern fuer Screens, Components, Hooks, API und Utils.

```bash
npx dabi g feature customers
# oder kurz
npx dabi g f customers
```

#### Screens (Seiten)

Erstellt eine neue Screen-Komponente und registriert sie im TanStack Router (`src/router.tsx`).

```bash
npx dabi g screen Shop
# oder kurz
npx dabi g s Shop

# direkt in ein Feature
npx dabi g screen List --feature customers
```

## Projektstruktur

Wenn du Ressourcen generierst, folgt die CLI dieser Struktur:

- **Features:** `src/features/<feature>/*`
- **Feature Screens:** `src/features/<feature>/screens/*.tsx`

## Voraussetzungen

- Node.js (v18+)
- `tsx` (wird automatisch mit `npx` verwendet)
