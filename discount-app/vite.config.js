import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode,process.cwd(),'');
  return {
  define: {
    'process.env': env,
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
  },
  resolve: {
     alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc'
    },
  },
   build:{
       target: "esnext"
   },
  }
});
