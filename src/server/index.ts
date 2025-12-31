import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { glob } from 'glob';
import path from 'node:path';
import fs from 'node:fs';
import { getAuthMiddleware } from './auth.js';


export interface ServerOptions {
    port?: number;
    apiDir?: string;
    routePrefix?: string;
    distDir?: string;
}

export async function createServer(options: ServerOptions = {}) {
    const app = new Hono();
    const apiDirRelative = options.apiDir || 'src/api';
    const prefix = options.routePrefix || '/api';
    const distDir = options.distDir || './dist';
    const port = options.port || 3000;

    console.log('Starting server...');

    // Load API Routes
    async function loadRoutes() {
        const apiDir = path.resolve(process.cwd(), apiDirRelative);
        if (fs.existsSync(apiDir)) {
            const files = await glob('**/*.ts', { cwd: apiDir });
            for (const file of files) {
                const filePath = path.join(apiDir, file);
                const relativePath = file.replace(/\.ts$/, '');

                let routePath = prefix + '/' + relativePath
                    .replace(/index$/, '')
                    .replace(/\[(.*?)\]/g, ':$1');

                if (routePath.endsWith('/') && routePath !== prefix && routePath !== prefix + '/') {
                    routePath = routePath.slice(0, -1);
                }

                routePath = routePath.replace('//', '/');
                if (routePath === prefix + '/') routePath = prefix;

                console.log(`Loading route: ${routePath} from ${file}`);

                try {
                    const mod = await import(filePath);
                    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] as const;
                    methods.forEach(method => {
                        if (mod[method]) {
                            const authConfig = mod.auth || mod.config?.auth;

                            // Use method-specific functions
                            if (authConfig) {
                                const authMiddleware = getAuthMiddleware(authConfig);
                                switch (method) {
                                    case 'GET':
                                        app.get(routePath, authMiddleware, (c: any) => mod[method](c));
                                        break;
                                    case 'POST':
                                        app.post(routePath, authMiddleware, (c: any) => mod[method](c));
                                        break;
                                    case 'PUT':
                                        app.put(routePath, authMiddleware, (c: any) => mod[method](c));
                                        break;
                                    case 'DELETE':
                                        app.delete(routePath, authMiddleware, (c: any) => mod[method](c));
                                        break;
                                    case 'PATCH':
                                        app.patch(routePath, authMiddleware, (c: any) => mod[method](c));
                                        break;
                                    case 'OPTIONS':
                                        app.options(routePath, authMiddleware, (c: any) => mod[method](c));
                                        break;
                                }
                            } else {
                                switch (method) {
                                    case 'GET':
                                        app.get(routePath, (c: any) => mod[method](c));
                                        break;
                                    case 'POST':
                                        app.post(routePath, (c: any) => mod[method](c));
                                        break;
                                    case 'PUT':
                                        app.put(routePath, (c: any) => mod[method](c));
                                        break;
                                    case 'DELETE':
                                        app.delete(routePath, (c: any) => mod[method](c));
                                        break;
                                    case 'PATCH':
                                        app.patch(routePath, (c: any) => mod[method](c));
                                        break;
                                    case 'OPTIONS':
                                        app.options(routePath, (c: any) => mod[method](c));
                                        break;
                                }
                            }
                            console.log(`  - Registered ${method}${authConfig ? ' (protected)' : ''}`);
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
        root: distDir,
    }));

    // SPA Fallback
    app.get('*', serveStatic({
        root: distDir,
        path: 'index.html'
    }));

    return {
        app,
        start: () => {
            console.log(`Server is running on http://localhost:${port}`);
            serve({
                fetch: app.fetch,
                port
            });
        }
    }
}
