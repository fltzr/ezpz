/// <reference types="vitest/config" />

import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    viteTsconfigPaths(),
  ],

  resolve: {
    alias: {
      '@cloudscape-design/components/i18n': path.resolve(
        __dirname,
        'node_modules/@cloudscape-design/components/i18n'
      ),
      '@cloudscape-design/components': path.resolve(__dirname, 'build/components'),
      '@cloudscape-design/design-tokens': path.resolve(__dirname, 'build/design-tokens'),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('all.') && !(id.includes('all.en') || id.includes('all.fr'))) {
            return 'unused-locales';
          }
        },
      },
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },

  preview: {
    port: 4000,
    strictPort: true,
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },

  test: {
    browser: {
      enabled: true,
      name: 'chrome',
      provider: 'webdriverio',
      providerOptions: {},
    },
  },
});
