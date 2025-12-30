import { type Plugin } from 'vite';
import { Hono } from 'hono';
import { glob } from 'glob';
import path from 'node:path';
import fs from 'node:fs';
import { getRequestListener } from '@hono/node-server';

export interface ApiRoutesOptions {
    apiDir?: string;
    routePrefix?: string;
}

export function apiRoutes(options: ApiRoutesOptions = {}): Plugin {
    const apiDirRelative = options.apiDir || 'src/api';
    const prefix = options.routePrefix || '/api';

    return {
        name: 'vite-plugin-dabi-api',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (!req.url?.startsWith(prefix)) {
                    return next();
                }

                const app = new Hono();
                const apiDir = path.resolve(process.cwd(), apiDirRelative);

                if (fs.existsSync(apiDir)) {
                    const files = await glob('**/*.ts', { cwd: apiDir });

                    for (const file of files) {
                        const filePath = path.join(apiDir, file);
                        const relativePath = file.replace(/\.ts$/, '');

                        // Route mapping logic
                        // index -> /
                        // [id] -> :id

                        let routePath = prefix + '/' + relativePath
                            .replace(/index$/, '')
                            .replace(/\[(.*?)\]/g, ':$1');

                        // Normalize trailing slashes
                        // If path is exactly /api/ don't strip it if it maps to index
                        // But usually /api/index -> /api/

                        if (routePath.endsWith('/') && routePath !== prefix && routePath !== prefix + '/') {
                            routePath = routePath.slice(0, -1);
                        }

                        // Double slash fix if prefix ends with / or relative starts with /
                        routePath = routePath.replace('//', '/');

                        if (routePath === prefix + '/') routePath = prefix;


                        try {
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

                const handler = getRequestListener(app.fetch);
                handler(req, res);
            });
        }
    };
}
