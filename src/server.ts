import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { glob } from 'glob';
import path from 'node:path';
import fs from 'node:fs';


// Fix for strict ESM mode if implicit globals aren't there

const app = new Hono();

console.log('Starting server...');

// Load API Routes
async function loadRoutes() {
    const apiDir = path.resolve(process.cwd(), 'src/api');
    if (fs.existsSync(apiDir)) {
        const files = await glob('**/*.ts', { cwd: apiDir });
        for (const file of files) {
            const filePath = path.join(apiDir, file);
            const relativePath = file.replace(/\.ts$/, '');

            let routePath = '/api/' + relativePath
                .replace(/index$/, '')
                .replace(/\[(.*?)\]/g, ':$1'); // Convert [id] to :id

            if (routePath.endsWith('/') && routePath !== '/api/') {
                routePath = routePath.slice(0, -1);
            }
            if (routePath === '/api/') routePath = '/api';

            console.log(`Loading route: ${routePath} from ${file}`);

            try {
                const mod = await import(filePath);
                const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] as const;
                methods.forEach(method => {
                    if (mod[method]) {
                        app.on(method, routePath, (c) => mod[method](c));
                        console.log(`  - Registered ${method}`);
                    }
                });
            } catch (err) {
                console.error(`Failed to load route ${file}:`, err);
            }
        }
    }
}

await loadRoutes();

// Serve Static Files (Frontend)
app.use('/*', serveStatic({
    root: './dist',
}));

// SPA Fallback
app.get('*', serveStatic({
    root: './dist',
    path: 'index.html'
}));

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port
});
