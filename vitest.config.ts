import path from 'path';
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        provider: 'v8',
        reporter: ['json'],
      },
      include: ['test/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    },
  })
);
