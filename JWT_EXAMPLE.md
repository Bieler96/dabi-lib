# JWT Authentication - Vollständiges Beispiel

Dieses Beispiel zeigt einen kompletten Authentifizierungs-Flow mit JWT.

## 1. Login-Endpunkt erstellen

```typescript
// src/api/auth/login.ts
import type { Context } from 'hono';
import { generateJWT } from 'dabi-lib';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const POST = async (c: Context) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ error: 'Username and password required' }, 400);
    }

    // Benutzer aus Datenbank laden
    const user = await db.select()
      .from(users)
      .where(eq(users.username, username))
      .get();

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Passwort prüfen (in Produktion: bcrypt verwenden!)
    // const isValid = await bcrypt.compare(password, user.passwordHash);
    // if (!isValid) return c.json({ error: 'Invalid credentials' }, 401);

    // JWT Token generieren
    const token = generateJWT(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role || 'user'
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return c.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
};
```

## 2. Geschützte Endpunkte erstellen

```typescript
// src/api/profile.ts
import type { Context } from 'hono';
import type { AuthConfig } from 'dabi-lib';

export const auth: AuthConfig = {
  jwt: {
    secret: process.env.JWT_SECRET!,
    verify: async (payload: any) => {
      // Prüfen ob Token gültig ist
      return !!payload.userId;
    }
  }
};

export const GET = async (c: Context) => {
  const user = c.get('jwtPayload');
  
  // Benutzer-Profil aus Datenbank laden
  // const profile = await db.select()...
  
  return c.json({
    userId: user.userId,
    username: user.username,
    email: user.email,
    role: user.role
  });
};

export const PATCH = async (c: Context) => {
  const user = c.get('jwtPayload');
  const updates = await c.req.json();
  
  // Profil aktualisieren
  // await db.update(users)...
  
  return c.json({ success: true, updates });
};
```

## 3. Admin-Only Endpunkte

```typescript
// src/api/admin/users.ts
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
  const admin = c.get('jwtPayload');
  
  // Alle Benutzer laden
  const allUsers = await db.select().from(users).all();
  
  return c.json({
    users: allUsers,
    requestedBy: admin.username
  });
};

export const DELETE = async (c: Context) => {
  const admin = c.get('jwtPayload');
  const userId = c.req.param('id');
  
  // Audit-Log
  console.log(`Admin ${admin.username} deleting user ${userId}`);
  
  await db.delete(users).where(eq(users.id, Number(userId)));
  
  return c.json({ success: true });
};
```

## 4. Frontend-Integration

```typescript
// Frontend: Login
async function login(username: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  
  if (data.token) {
    // Token speichern
    localStorage.setItem('jwt_token', data.token);
    return data.user;
  }
  
  throw new Error(data.error);
}

// Frontend: Geschützte API-Aufrufe
async function fetchProfile() {
  const token = localStorage.getItem('jwt_token');
  
  const response = await fetch('/api/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 401) {
    // Token abgelaufen - Benutzer ausloggen
    localStorage.removeItem('jwt_token');
    window.location.href = '/login';
    return;
  }
  
  return await response.json();
}

// Frontend: Logout
function logout() {
  localStorage.removeItem('jwt_token');
  window.location.href = '/login';
}
```

## 5. Umgebungsvariablen (.env)

```bash
# .env
JWT_SECRET=your-super-secret-key-min-256-bit-please-change-this-in-production
```

⚠️ **Wichtig:** Füge `.env` zu `.gitignore` hinzu!

## 6. Token-Refresh (Optional)

Für längere Sessions kannst du Refresh-Tokens implementieren:

```typescript
// src/api/auth/refresh.ts
import type { Context } from 'hono';
import { generateJWT, decodeJWT } from 'dabi-lib';

export const POST = async (c: Context) => {
  const { refreshToken } = await c.req.json();
  
  try {
    // Refresh-Token verifizieren
    const payload = decodeJWT(refreshToken);
    
    // Neuen Access-Token generieren
    const newToken = generateJWT(
      {
        userId: payload.userId,
        username: payload.username,
        role: payload.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }  // Kurze Lebensdauer für Access-Token
    );
    
    return c.json({ token: newToken });
  } catch (e) {
    return c.json({ error: 'Invalid refresh token' }, 401);
  }
};
```

## Best Practices

1. **Verwende kurze Ablaufzeiten** für Access-Tokens (15min - 1h)
2. **Implementiere Refresh-Tokens** für längere Sessions
3. **Speichere Passwörter gehasht** (bcrypt, argon2)
4. **Validiere Input** immer auf Server-Seite
5. **Implementiere Rate-Limiting** für Login-Endpunkte
6. **Logge Sicherheitsereignisse** (fehlgeschlagene Logins, etc.)
7. **Verwende HTTPS** in Produktion
8. **Rotiere JWT_SECRET** regelmäßig
