import path from 'node:path'

import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vitest/config'

// Dual-theme highlighting: shiki emits both palettes as CSS variables on every
// token, and globals.css swaps which set is live under `.dark`. `keepBackground`
// stays off so the code block sits on our own `--surface-soft` token instead of
// the shiki theme's background.
const prettyCodeOptions = {
  theme: { light: 'github-light', dark: 'github-dark-dimmed' },
  keepBackground: false,
  defaultLang: 'tsx',
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // `enforce: 'pre'` so .mdx is compiled to JSX before the React plugin sees
    // it; the React plugin's `include` is widened to match, which is what gives
    // MDX pages Fast Refresh.
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
        providerImportSource: '@mdx-js/react',
      }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
  ],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
