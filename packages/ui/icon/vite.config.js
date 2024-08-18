import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isProduction = process.env['NODE_ENV'] === 'production';

export default defineConfig({
  lib: {
      entry: "lib/index.js",
      name: "icon",
      fileName: "icon",
      jsx: isProduction ? 'react-jsx' : 'react-jsxdev',
  },
    plugins: [react()],
});
