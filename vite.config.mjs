import { defineConfig } from 'vite';

// Development preview only; publishing still uses the generated static files.
export default defineConfig({
  server: { host: '0.0.0.0', allowedHosts: ['terminal.local'] },
});
