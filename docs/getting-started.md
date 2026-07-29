# Getting started

For working **on** this repository. For using kairo-ui in another project, see
[the docs site](http://localhost:5173/docs/installation) or `src/content/docs/installation.mdx`.

## Requirements

- Node 20.11 or newer (`import.meta.dirname` is used in build tooling)
- npm 10+ — the repository uses npm workspaces for `cli/`

## Install and run

```bash
npm install
npm run dev
```

`npm install` covers the site and the CLI workspace in one pass.

## What runs where

| Route     | Component                      | Content                          |
| --------- | ------------------------------ | -------------------------------- |
| `/`       | `src/pages/landing.tsx`        | Hand-written React               |
| `/docs/*` | `src/pages/docs/docs-page.tsx` | `.mdx` under `src/content/docs/` |

`docs-page.tsx` maps the URL to a file with `import.meta.glob`, so adding
`src/content/docs/components/switch.mdx` makes `/docs/components/switch` work with no routing
change. It will not appear in the sidebar until it is listed in `src/content/docs/nav.ts`.

## The verification loop

```bash
npm run lint        # ESLint over src, scripts, cli
npm run typecheck   # tsc over the app, the Vite config, and the CLI
npm run test        # Vitest, single run
npm run build       # registry → tsc → vite build
```

`npm run build` runs `registry:build` first, so `public/r/` can never be stale relative to the
components in `src/`.

## Editing a component

Component files are the product. They are also the registry payload — `scripts/build-registry.mjs`
inlines them verbatim — so a change here is a change to what every consumer downloads.

After editing, run `npm run registry:build` if you want the local registry to match before
testing the CLI.

## Editing docs

MDX pages start at `##`. The `h1`, the eyebrow and the description above the content all come
from the entry in `nav.ts`, so a page's title lives in exactly one place.

Available in MDX without importing:

- `<ComponentPreview name="button-demo" />` — live demo plus its source, both from
  `src/content/docs/demos/button-demo.tsx`
- `<Callout>` — an inset note

Fenced code blocks are highlighted at build time by shiki, dual-themed, with a copy button
attached automatically. Add a filename by putting `title="…"` on the info string of the fence —
for example, opening a block with `ts title="vite.config.ts"` renders the filename as a caption
above the code.

## Testing the CLI

The CLI reads a registry over HTTP or from disk. During development, use disk:

```bash
npm run registry:build
npm run cli:build

mkdir /tmp/consumer && cd /tmp/consumer
npm init -y
echo '{"compilerOptions":{"paths":{"@/*":["./src/*"]}}}' > tsconfig.json

node /path/to/kairo-ui/cli/dist/index.js init --cwd . --registry /path/to/kairo-ui/public/r -y
node /path/to/kairo-ui/cli/dist/index.js add button --cwd . --registry /path/to/kairo-ui/public/r -y
```

`init` is idempotent — the token block it writes is delimited by marker comments, so a second
run refreshes the tokens and leaves everything you added around them alone.

## Common problems

**`Could not resolve the alias "@/lib"`** — the target project has no matching
`compilerOptions.paths` entry. The CLI refuses to guess, because guessing writes source into a
directory the project does not import from.

**MDX changes not appearing** — the React plugin needs `.mdx` in its `include` regex for Fast
Refresh. It is already set in `vite.config.ts`; if you change the plugin order, MDX must stay
`enforce: 'pre'`.

**Tailwind classes not applying in a new directory** — Tailwind v4 scans automatically, but
files outside the project root are not picked up. Keep source under `src/`.
