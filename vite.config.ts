import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    /**
     * The GLBViewer chunk (~1 MB) contains Three.js and is already lazy-loaded.
     * It cannot be split further without breaking the 3D rendering pipeline.
     * Raising the limit avoids a false-positive warning for this expected outlier.
     */
    chunkSizeWarningLimit: 1100,
    rolldownOptions: {
      output: {
        /**
         * Code-splitting configuration to keep chunk sizes under 500 kB.
         *
         * - "elements-data": Isolates the ~286 KB elements.json into its own
         *   chunk. This data rarely changes, so it benefits from separate
         *   browser caching.
         *
         * The GLBViewer (Three.js) chunk is already automatically split
         * via React.lazy() dynamic import.
         */
        codeSplitting: {
          groups: [
            {
              name: 'elements-data',
              test: /elements\.json/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
})
