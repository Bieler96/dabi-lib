import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { apiRoutes } from './src/vite/index'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		libInjectCss(),
		apiRoutes(),
		dts({
			include: ['src'],
			exclude: [
				'src/App.tsx',
				'src/main.tsx',
				'src/server.ts',
				'src/api/**',
				'src/screens/**',
				'src/db/schema.ts'
			],
			insertTypesEntry: true,
			tsconfigPath: './tsconfig.app.json'
		})
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'DabiLib',
			fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
			formats: ['es', 'cjs']
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
})
