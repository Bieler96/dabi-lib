# API Authentication

Die `dabi-lib` unterstützt jetzt die Absicherung von API-Endpunkten mit Bearer-Token, API-Keys oder **JWT (JSON Web Tokens)**.

## Verwendung

### 1. Authentication in API-Routen konfigurieren

Exportiere eine `auth`-Konfiguration in deiner API-Route:

```typescript
import type { Context } from 'hono';
import type { AuthConfig } from 'dabi-lib';

// Authentifizierung konfigurieren
export const auth: AuthConfig = {
  bearer: ['my-secret-token', 'another-valid-token'],
  // oder API-Key:
  // apiKey: ['my-api-key', 'another-key'],
  // oder beides (OR-Logik):
  // bearer: ['token1'],
  // apiKey: ['key1']
};

export const GET = async (c: Context) => {
  return c.json({ message: 'Protected endpoint!' });
};
```

### 2. Authentifizierungsmethoden

#### Bearer Token

```typescript
export const auth: AuthConfig = {
  bearer: 'single-token'  // Ein einzelner Token
  // oder
  bearer: ['token1', 'token2']  // Mehrere gültige Tokens
};
```

**Verwendung:**
```bash
curl -H "Authorization: Bearer my-secret-token" http://localhost:3000/api/protected
```

#### API Key

```typescript
export const auth: AuthConfig = {
  apiKey: 'my-api-key'  // Ein einzelner Key
  // oder
  apiKey: ['key1', 'key2']  // Mehrere gültige Keys
};
```

**Verwendung:**
```bash
# Als Header
curl -H "x-api-key: my-api-key" http://localhost:3000/api/protected

# Als Query-Parameter
curl http://localhost:3000/api/protected?apiKey=my-api-key
```

#### JWT (JSON Web Token)

JWT ist die empfohlene Methode für moderne Authentifizierung mit Benutzerinformationen und Ablaufzeiten.

```typescript
export const auth: AuthConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    algorithms: ['HS256'],  // Optional, Standard: ['HS256']
    verify: async (payload: any) => {
      // Optional: Benutzerdefinierte Verifizierung
      // z.B. Prüfung der Benutzerrolle oder Datenbankabfrage
      return payload.role === 'admin';
    }
  }
};
```

**Token generieren:**
```typescript
// In einer Login-Route
import { generateJWT } from 'dabi-lib';

export const POST = async (c: Context) => {
  const { username, password } = await c.req.json();
  
  // Authentifizierung prüfen...
  
  const token = generateJWT(
    { 
      userId: 123, 
      username: 'john',
      role: 'admin' 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
  
  return c.json({ token });
};
```

**Verwendung:**
```bash
# JWT Token im Authorization Header
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." http://localhost:3000/api/jwt-protected
```

**Payload im Handler zugreifen:**
```typescript
export const GET = async (c: Context) => {
  const jwtPayload = c.get('jwtPayload');
  // jwtPayload enthält die dekodierten Token-Daten
  return c.json({ user: jwtPayload });
};
```


#### Kombinierte Authentifizierung (OR-Logik)

Wenn mehrere Methoden konfiguriert sind, wird der Zugriff gewährt, wenn **eine** der Methoden erfolgreich ist:

```typescript
export const auth: AuthConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key'
  },
  apiKey: ['fallback-key']  // Fallback für Legacy-Systeme
};
```

Der Benutzer kann sich entweder mit einem JWT-Token **oder** einem API-Key authentifizieren.

### 3. Umgebungsvariablen

Wenn `bearer: true` oder `apiKey: true` gesetzt wird, werden die Werte aus Umgebungsvariablen gelesen:

```typescript
export const auth: AuthConfig = {
  bearer: true,  // Verwendet process.env.DABI_BEARER_TOKEN
  apiKey: true   // Verwendet process.env.DABI_API_KEY
};
```

Für JWT solltest du **immer** Umgebungsvariablen verwenden:

```typescript
export const auth: AuthConfig = {
  jwt: {
    secret: process.env.JWT_SECRET  // WICHTIG: Niemals hardcoden!
  }
};
```

### 4. Fehlerbehandlung

Bei fehlgeschlagener Authentifizierung wird ein `401 Unauthorized` Response zurückgegeben:

```json
{
  "error": "Unauthorized",
  "details": [
    "Invalid JWT: jwt expired",
    "Invalid or missing API Key"
  ]
}
```

## Beispiel: JWT-basierte User-API

```typescript
// src/api/auth/login.ts - Token generieren
import { generateJWT } from 'dabi-lib';

export const POST = async (c: Context) => {
  const { username, password } = await c.req.json();
  
  // Benutzer authentifizieren (z.B. Datenbank-Abfrage)
  // ...
  
  const token = generateJWT(
    { userId: 123, username, role: 'admin' },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
  
  return c.json({ token });
};
```

```typescript
// src/api/admin/users.ts - Geschützte Route
import type { Context } from 'hono';
import type { AuthConfig } from 'dabi-lib';

export const auth: AuthConfig = {
  jwt: {
    secret: process.env.JWT_SECRET!,
    verify: async (payload: any) => {
      // Nur Admins erlauben
      return payload.role === 'admin';
    }
  }
};

export const GET = async (c: Context) => {
  const user = c.get('jwtPayload');
  // Nur authentifizierte Admins kommen hierher
  return c.json({ users: [...], requestedBy: user.username });
};

export const DELETE = async (c: Context) => {
  const id = c.req.param('id');
  const user = c.get('jwtPayload');
  
  // Geschützte DELETE-Operation mit Audit-Log
  console.log(`User ${user.username} deleted user ${id}`);
  return c.json({ success: true });
};
```

## Best Practices

1. **Verwende JWT für moderne Anwendungen** - JWT bietet die beste Balance zwischen Sicherheit und Flexibilität
2. **Verwende Umgebungsvariablen** für alle Secrets (JWT_SECRET, API-Keys, etc.)
3. **Niemals Secrets im Code committen** - verwende `.env`-Dateien und `.gitignore`
4. **Setze angemessene Ablaufzeiten** für JWT-Tokens (z.B. 15min für Access-Token, 7d für Refresh-Token)
5. **Verwende starke Secrets** - mindestens 256 Bit für JWT_SECRET
6. **Implementiere Token-Rotation** für langlebige Tokens
7. **Verwende HTTPS** in Produktion, um Token-Diebstahl zu verhindern
8. **Validiere JWT-Payload** mit der `verify`-Funktion für zusätzliche Sicherheit

## JWT-spezifische Best Practices

1. **Speichere keine sensiblen Daten** im JWT-Payload (er ist nur base64-kodiert, nicht verschlüsselt)
2. **Verwende kurze Ablaufzeiten** und implementiere Refresh-Tokens
3. **Prüfe die Signatur** immer auf Server-Seite
4. **Verwende verschiedene Secrets** für verschiedene Umgebungen (dev, staging, prod)
5. **Implementiere Token-Blacklisting** für ausgeloggte Benutzer (optional)

## Sicherheitshinweise

⚠️ **Wichtig:**
- Die Authentifizierung erfolgt auf Endpunkt-Ebene
- **JWT ist die empfohlene Methode** für moderne Anwendungen
- Bearer-Tokens und API-Keys sind für einfache Anwendungsfälle oder Legacy-Systeme
- Verwende **immer HTTPS** in Produktion
- JWT-Secrets müssen **geheim** bleiben - niemals im Code oder in Git speichern
- Implementiere **Rate-Limiting** für Login-Endpunkte
- Überwache **fehlgeschlagene Authentifizierungsversuche**
