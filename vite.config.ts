import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            outDir: 'public/build',
            manifest: {
                name: 'E-Brain Application',
                short_name: 'E-Brain',
                description: 'Your spiritual companion for Umrah and daily Duas.',
                start_url: '/',
                scope: '/',
                display: 'standalone',
                background_color: '#644f29',
                theme_color: '#644f29',
                icons: [
                    {
                        src: '/dark.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable'
                    },
                    {
                        src: '/dark.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    server: {
        port: 5174,   // change to any free port
        strictPort: true,
    },
});
