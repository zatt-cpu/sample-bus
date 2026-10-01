import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import busArrivalHandler from './api/bus-arrival';
import healthHandler from './api/health.js';

function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url.startsWith('/api/') || req.url.startsWith('/api?'))) {
          try {
            const url = new URL(req.url, 'http://localhost:3000');
            const query: Record<string, string> = {};
            url.searchParams.forEach((val, key) => {
              query[key] = val;
            });
            (req as any).query = query;

            (res as any).status = function (code: number) {
              res.statusCode = code;
              return res;
            };

            (res as any).json = function (data: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };

            if (url.pathname.startsWith('/api/health')) {
              return await healthHandler(req, res);
            }

            return await busArrivalHandler(req, res);
          } catch (err) {
            console.error('API middleware error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal API middleware error' }));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevMiddleware()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

