import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

/**
 * A deliberately minimal shiki build: one grammar, two themes, and the
 * JavaScript regex engine instead of the WASM oniguruma one.
 *
 * Importing `shiki` directly would pull every bundled language into the output
 * — around 200 lazy chunks and a 600 kB WASM blob — for the sake of
 * highlighting a handful of tsx demos.
 */
let highlighter: Promise<HighlighterCore> | null = null

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    langs: [import('shiki/langs/tsx.mjs')],
    themes: [
      import('shiki/themes/github-light.mjs'),
      import('shiki/themes/github-dark-dimmed.mjs'),
    ],
    engine: createJavaScriptRegexEngine(),
  })
  return highlighter
}

/**
 * `defaultColor: false` emits both palettes as `--shiki-light` / `--shiki-dark`
 * custom properties, which globals.css already switches between — the same
 * mechanism build-time MDX blocks use.
 */
export async function highlightTsx(code: string): Promise<string> {
  const instance = await getHighlighter()
  return instance.codeToHtml(code, {
    lang: 'tsx',
    themes: { light: 'github-light', dark: 'github-dark-dimmed' },
    defaultColor: false,
  })
}
