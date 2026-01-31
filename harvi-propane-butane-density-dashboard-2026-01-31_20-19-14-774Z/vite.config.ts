import { defineConfig } from 'vite';
import harvey from '@harvey-ui/vite-plugin';

export default defineConfig({
  // Ключевая настройка для GitHub Pages!
  base: '/harvi-propane-butane-density-dashboard-2026-01-31_20-19-14-774Z/',

  plugins: [harvey()],
  
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
