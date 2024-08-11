// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
<<<<<<< HEAD
    target: "es2020",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
  },
});
=======
    target: 'es2020', // you can also use 'es2020' here
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 kB
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext", 
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      supported: { 
        bigint: true 
      },
    }
  },
  plugins: [
    react(),
    legacy()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
>>>>>>> 8646867 (wip)
