import { type Plugin } from "vite";
import { Hono, type Context } from "hono";
import { glob } from "glob";
import path from "node:path";
import fs from "node:fs";
import { getRequestListener } from "@hono/node-server";

import { getAuthMiddleware } from "../api.js";
import type { AuthConfig } from "../api.js";

export interface ApiRoutesOptions {
	apiDir?: string;
	routePrefix?: string;
}

type RouteHandler = (c: Context) => Response | Promise<Response>;
type RouteModule = Record<string, unknown> & {
	auth?: AuthConfig;
	config?: { auth?: AuthConfig };
};

export function apiRoutes(options: ApiRoutesOptions = {}): Plugin {
	const apiDirRelative = options.apiDir || "src/api";
	const prefix = options.routePrefix || "/api";

	return {
		name: "vite-plugin-dabi-api",
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				if (!req.url?.startsWith(prefix)) {
					return next();
				}

				const app = new Hono();
				const apiDir = path.resolve(process.cwd(), apiDirRelative);

				if (fs.existsSync(apiDir)) {
					const files = await glob("**/*.ts", { cwd: apiDir });

					for (const file of files) {
						const filePath = path.join(apiDir, file);
						const relativePath = file.replace(/\.ts$/, "");

						// Route mapping logic
						// index -> /
						// [id] -> :id

						let routePath =
							prefix +
							"/" +
							relativePath
								.replace(/index$/, "")
								.replace(/\[(.*?)\]/g, ":$1");

						// Normalize trailing slashes
						// If path is exactly /api/ don't strip it if it maps to index
						// But usually /api/index -> /api/

						if (
							routePath.endsWith("/") &&
							routePath !== prefix &&
							routePath !== prefix + "/"
						) {
							routePath = routePath.slice(0, -1);
						}

						// Double slash fix if prefix ends with / or relative starts with /
						routePath = routePath.replace("//", "/");

						if (routePath === prefix + "/") routePath = prefix;

						try {
							const mod = (await server.ssrLoadModule(
								filePath,
							)) as RouteModule;
							const methods = [
								"GET",
								"POST",
								"PUT",
								"DELETE",
								"PATCH",
								"OPTIONS",
							] as const;

							methods.forEach((method) => {
								const handler = mod[method];
								if (typeof handler === "function") {
									const authConfig =
										mod.auth || mod.config?.auth;
									const routeHandler =
										handler as RouteHandler;

									// Use method-specific functions
									if (authConfig) {
										const authMiddleware =
											getAuthMiddleware(authConfig);
										switch (method) {
											case "GET":
												app.get(
													routePath,
													authMiddleware,
													(c) => routeHandler(c),
												);
												break;
											case "POST":
												app.post(
													routePath,
													authMiddleware,
													(c) => routeHandler(c),
												);
												break;
											case "PUT":
												app.put(
													routePath,
													authMiddleware,
													(c) => routeHandler(c),
												);
												break;
											case "DELETE":
												app.delete(
													routePath,
													authMiddleware,
													(c) => routeHandler(c),
												);
												break;
											case "PATCH":
												app.patch(
													routePath,
													authMiddleware,
													(c) => routeHandler(c),
												);
												break;
											case "OPTIONS":
												app.options(
													routePath,
													authMiddleware,
													(c) => routeHandler(c),
												);
												break;
										}
									} else {
										switch (method) {
											case "GET":
												app.get(routePath, (c) =>
													routeHandler(c),
												);
												break;
											case "POST":
												app.post(routePath, (c) =>
													routeHandler(c),
												);
												break;
											case "PUT":
												app.put(routePath, (c) =>
													routeHandler(c),
												);
												break;
											case "DELETE":
												app.delete(routePath, (c) =>
													routeHandler(c),
												);
												break;
											case "PATCH":
												app.patch(routePath, (c) =>
													routeHandler(c),
												);
												break;
											case "OPTIONS":
												app.options(routePath, (c) =>
													routeHandler(c),
												);
												break;
										}
									}
								}
							});
						} catch (e) {
							console.error(
								`Error loading API route ${file}:`,
								e,
							);
							return next(e);
						}
					}
				}

				const handler = getRequestListener(app.fetch);
				handler(req, res);
			});
		},
	};
}
