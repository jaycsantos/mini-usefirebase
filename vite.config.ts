import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    //Specifies that the output of the build will be a library.
    lib: {
      //Defines the entry point for the library build. It resolves
      //to src/index.ts,indicating that the library starts from this file.
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'useFirebase',
      //A function that generates the output file
      //name for different formats during the build
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'firebase/firestore',
        'firebase/app',
        'firebase/auth',
        'firebase/analytics',
        '@firebase/app-compat',
      ],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
    //Generates sourcemaps for the built files,
    //aiding in debugging.
    sourcemap: true,
    //Clears the output directory before building.
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  //react() enables React support.
  //dts() generates TypeScript declaration files (*.d.ts)
  //during the build.
  plugins: [react(), dts({ rollupTypes: true }), tsconfigPaths()],
});
