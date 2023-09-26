import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
       target: "esnext",
       rollupOptions: {
         external: [ "@supabase/supabase-js" ],
       },
   },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
