# kairo-ui

Accessible React components built on **Tailwind CSS v4** and **Radix UI**. Not a package you
import from — source code you copy into your project and own.

This repository holds three things:

- the **component library** (`src/components/ui`)
- the **docs site and landing page** that document it (`src/pages`, `src/content/docs`)
- the **registry and CLI** that install it into other projects (`registry.json`, `cli/`)

## Quick start

```bash
npm install
npm run dev
```

The site runs at `http://localhost:5173`. `/` is the landing page, `/docs` is the documentation.

## Scripts

| Command                  | What it does                                             |
| ------------------------ | -------------------------------------------------------- |
| `npm run dev`            | Vite dev server with HMR, including `.mdx` pages         |
| `npm run build`          | Builds the registry, typechecks, then bundles to `dist/` |
| `npm run preview`        | Serve the production build                               |
| `npm run lint`           | ESLint over `src`, `scripts` and `cli`                   |
| `npm run format`         | Prettier, with Tailwind class sorting                    |
| `npm run format:check`   | Prettier in check mode                                   |
| `npm run typecheck`      | `tsc` over the app, the Vite config and the CLI          |
| `npm run test`           | Vitest once — exits, so CI and tooling can call it       |
| `npm run test:watch`     | Vitest in watch mode                                     |
| `npm run registry:build` | Regenerate `public/r/` from `registry.json`              |
| `npm run cli:build`      | Compile the CLI to `cli/dist`                            |

## Using the CLI locally

```bash
npm run registry:build
npm run cli:build

node cli/dist/index.js init --cwd ../some-project --registry ./public/r
node cli/dist/index.js add button card --cwd ../some-project --registry ./public/r
```

A `--registry` starting with `.` or `/` is read from disk instead of fetched, so you can test
registry changes before publishing them.

## Layout

```
kairo-ui/
├── cli/                     # the `kairo-ui` npm package
│   └── src/
│       ├── commands/        # init, add, list
│       ├── config.ts        # kairo.json + tsconfig paths resolution
│       ├── registry.ts      # fetch and dependency-graph resolution
│       └── write-files.ts   # alias mapping and import rewriting
├── docs/                    # project-level docs (this repo, not the site)
├── public/r/                # generated registry — served at /r/*.json
├── scripts/
│   └── build-registry.mjs   # registry.json → public/r
├── src/
│   ├── components/
│   │   ├── ui/              # the library itself
│   │   ├── layout/          # header, footer, theme toggle, mobile nav
│   │   └── docs/            # sidebar, search, TOC, pager, MDX map
│   ├── content/docs/        # .mdx pages, demos, and nav.ts
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── styles/
│   │   ├── tokens.css       # design tokens — shipped to consumers verbatim
│   │   ├── globals.css      # tokens + site-only rules
│   │   └── theme.md         # where every token came from
│   └── theme/               # light/dark/system provider
├── registry.json            # hand-maintained registry manifest
└── vite.config.ts           # MDX → React, Tailwind, path alias, Vitest
```

There is no `tailwind.config.js` and no `postcss.config.js`. Tailwind v4 is configured from
CSS, in `src/styles/tokens.css`.

## Documentation

- [Getting started](./docs/getting-started.md) — running and extending this repository
- [Architecture](./docs/architecture.md) — how the docs system and registry fit together
- [Design tokens](./docs/design-tokens.md) — the token set and the reasoning behind it
- [Theme provenance](./src/styles/theme.md) — what came from the reference design system
- [Contributing](./CONTRIBUTING.md)

## Known issues

`react-router` 7.12–7.18 carries [GHSA-qwww-vcr4-c8h2](https://github.com/advisories/GHSA-qwww-vcr4-c8h2),
a CSRF bypass in **RSC mode**. This site is a client-rendered SPA with no server actions, so the
affected code path is never reached, and there is no patched release in the 7.x line — npm's
only suggested remedy is a downgrade to 7.11. Revisit when 8.3 ships.

## License

MIT.
