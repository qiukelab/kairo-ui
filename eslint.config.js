import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import configPrettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  // MDX is not parseable by typescript-eslint. Prose lives in src/content/docs
  // and is checked by the build (and by Prettier), not by ESLint.
  globalIgnores(['dist', 'cli/dist', 'public/r', '**/*.mdx']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // The registry builder and the CLI run on Node, not in the browser.
  {
    files: ['scripts/**/*.mjs', 'cli/**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  // Must stay last: switches off every stylistic rule Prettier owns.
  configPrettier,
])
