/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },

  preview: {
    port: 4000,
    strictPort: true,
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
