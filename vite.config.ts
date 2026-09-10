import { defineConfig } from 'vite';

export default defineConfig({
  base: '/resonance/',
  build: {
    rollupOptions: {
      input: {
        game: 'index.html',
        conductorLab: 'conductor-lab.html',
      },
      output: {
        manualChunks: (id) =>
          id.includes('node_modules/three/') ? 'three' : undefined,
      },
    },
  },
});
