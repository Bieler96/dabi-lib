import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(() => { // Removed `command` as it's not needed for client build
	return {
		plugins: [
			react(),
			tailwindcss(),
		].filter(Boolean),
	};
});