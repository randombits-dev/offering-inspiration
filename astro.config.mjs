import {defineConfig} from 'astro/config';
import yaml from '@rollup/plugin-yaml';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
    plugins: [yaml()]
  }
});
