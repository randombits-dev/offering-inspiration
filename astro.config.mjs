import {defineConfig} from 'astro/config';
import yaml from '@rollup/plugin-yaml';
import sitemap from '@astrojs/sitemap';

import robots from "astro-robots";

// https://astro.build/config
export default defineConfig({
  site: 'https://offeringinspiration.com',
  integrations: [sitemap(), robots({})],
  vite: {
    build: {
      assetsInlineLimit: 0
    },
    plugins: [yaml()]
  },
  trailingSlash: 'never',
  build: {
    format: 'file'
  }
});
