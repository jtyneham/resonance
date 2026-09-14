import { defineConfig } from 'vite';

export default defineConfig({
  base: '/resonance/',
  build: {
    rollupOptions: {
      input: {
        game: 'index.html',
        conductorLab: 'conductor-lab.html',
        wristLab: 'wrist-lab.html',
        styledLab: 'styled-lab.html',
        fingerLab: 'finger-lab.html',
        windupLab: 'windup-lab.html',
        meterLab: 'meter-lab.html',
        idleLab: 'idle-lab.html',
      },
      output: {
        manualChunks: (id) =>
          id.includes('node_modules/three/') ? 'three' : undefined,
      },
    },
  },
});
