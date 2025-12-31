import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import type { LibraryFormats } from 'vite'

// https://vite.dev/config/
export default defineConfig(() => { // Removed `command` as it's not needed for client build
	return {
		plugins: [
			react(),
			tailwindcss(),
			libInjectCss(),
			dts({
				include: ['src'],
				exclude: [
					'src/App.tsx',
					'src/main.tsx',
					'src/server/**', // Exclude all server code
					'src/api/**', // Exclude all api code
					'src/screens/**',
					'src/db/**', // Exclude db code
					'src/vite/**' // Exclude vite plugin code
				],
				insertTypesEntry: true,
				tsconfigPath: './tsconfig.app.json'
			})
		].filter(Boolean),

		build: {
			emptyOutDir: false,
			lib: {
				entry: {
					index: resolve(__dirname, 'src/index.ts')
				},
				formats: ['es', 'cjs'] as LibraryFormats[]
			},
			rollupOptions: {
				external: [
					'react',
					'react-dom',
					'lucide-react',
					'framer-motion',
					'clsx',
					'tailwind-merge',
					'class-variance-authority'
				],
				output: {
					globals: {
						react: 'React',
						'react-dom': 'ReactDOM',
						'lucide-react': 'LucideReact'
					}
				}
			}
		}
	};
});