import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import type { LibraryFormats, Plugin } from 'vite' // Import Plugin type
import { apiRoutes } from './src/vite/index' // Only needed for dev server context, not for build

// Custom Rollup plugin to handle native modules like '../pkg'
function nativeModuleResolvePlugin(): Plugin {
  return {
    name: 'native-module-resolve',
    resolveId(source: string, importer: string | undefined) {
      if (source.includes('../pkg')) {
        // Log to see what's trying to import '../pkg'
        console.log(`[nativeModuleResolvePlugin] Intercepted resolve for: ${source} imported by ${importer}`);
        // Mark it as external so Rollup doesn't try to bundle it
        return { id: source, external: true };
      }
      return null; // Let other resolvers handle it
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command }) => {
	return {
		plugins: [
            // Only include apiRoutes for dev server context, which uses this config
            // when `command === 'serve'` for specific server-side development.
            // For building, it will be skipped by `command !== 'serve'`
			command === 'serve' && apiRoutes(),
			dts({
				include: ['src/vite', 'src/server', 'src/api.ts'], // Include only vite and server for d.ts
				insertTypesEntry: true,
				tsconfigPath: './tsconfig.app.json' // Assuming tsconfig.app.json is fine for this too
			}),
            nativeModuleResolvePlugin() // Add the custom plugin here
		].filter(Boolean),

		build: {
			emptyOutDir: false,
            // Target Node.js for these modules
            target: 'node20', // Specify Node.js version
            outDir: 'dist', // Output to dist folder
			lib: {
				entry: {
					vite: resolve(__dirname, 'src/vite/index.ts'),
					server: resolve(__dirname, 'src/server/index.ts'),
					api: resolve(__dirname, 'src/api.ts')
				},
				formats: ['es', 'cjs'] as LibraryFormats[]
			},
			rollupOptions: {
								external: (id: string) => {
				                    if (id.startsWith('node:')) {
				                        return true;
				                    }
				                    const externals = [
				                        'hono',
				                        'glob',
				                        '@hono/node-server',
				                        'jsonwebtoken',
				                        'better-sqlite3',
				                        'drizzle-orm',
				                        'commander',
				                        'fs-extra',
				                        'inquirer',
				                        'picocolors',
				                        'fsevents',
				                        'chokidar',
				                                                'esbuild',
				                                                'detect-libc', // Add detect-libc
				                                                'fdir', // Add fdir
				                                                'get-tsconfig', // Add get-tsconfig
				                                                'tinyglobby', // Add tinyglobby
				                                                'jiti', // Add jiti
				                                                'rollup', // Add rollup
                                                                'vite' // Externalize vite itself
				                                            ];				                    return externals.some(ext => id === ext || id.startsWith(`${ext}/`));
				                },			}
		}
	};
});