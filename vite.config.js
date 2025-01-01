import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: '/src/main.jsx',
            output: {
              assetFileNames: 'assets/[name][extname]',
              entryFileNames: 'assets/[name].js',
            }
        },
    },
    server: {
        proxy: {
            // Proxy backend requests to the WordPress server
            '/wp-json': 'http://branden-music/', // Update with your Local by Flywheel WordPress URL
        },
    },
});
