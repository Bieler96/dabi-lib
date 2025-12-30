import { type Plugin } from 'vite';
import { Hono } from 'hono';
import { glob } from 'glob';
import path from 'node:path';
import fs from 'node:fs';
import { getRequestListener } from '@hono/node-server';

export function apiRoutes(): Plugin {
    return {
        name: 'vite-plugin-dabi-api',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (!req.url?.startsWith('/api')) {
                    return next();
                }

                const app = new Hono();

                // Fix for Hono to work with simple paths if needed, but we mount at / usually.
                // Since we are creating a fresh app, we can just register routes matching the full URL.

                const apiDir = path.resolve(process.cwd(), 'src/api');
                if (fs.existsSync(apiDir)) {
                    const files = await glob('**/*.ts', { cwd: apiDir });

                    for (const file of files) {
                        const filePath = path.join(apiDir, file);
                        const relativePath = file.replace(/\.ts$/, '');

                        // Route mapping logic
                        // index -> /
                        // [id] -> :id
                        // [...slug] -> * (catch all - optional)

                        let routePath = '/api/' + relativePath
                            .replace(/index$/, '')
                            .replace(/\[(.*?)\]/g, ':$1');

                        // Normalize trailing slashes
                        if (routePath.endsWith('/') && routePath !== '/api/') {
                            routePath = routePath.slice(0, -1);
                        }
                        // If it was just index
                        if (routePath === '/api/') routePath = '/api';

                        try {
                            // Use ssrLoadModule to compile TS on the fly and handle HMR
                            const mod = await server.ssrLoadModule(filePath);

                            const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] as const;

                            methods.forEach(method => {
                                if (mod[method]) {
                                    app.on(method, routePath, async (c) => {
                                        return mod[method](c);
                                    });
                                }
                            });
                        } catch (e) {
                            console.error(`Error loading API route ${file}:`, e);
                            return next(e);
                        }
                    }
                }

                // Handle the request with Hono
                const handler = getRequestListener(app.fetch);
                handler(req, res);
            });
        }
    };
}
