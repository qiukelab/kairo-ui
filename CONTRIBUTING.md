# Contributing

## Before you start

```bash
npm install
npm run dev
```

## Branches

One branch, one intent.

```
feat/tooltip-arrow-offset
fix/sidebar-active-state
docs/theming-oklch-rationale
chore/bump-radix
```

If a change needs two sentences with "and" to describe, it is two branches.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/):

```
feat(button): add icon-xs size
fix(toc): keep the last heading active past the scroll band
docs(theming): explain why the brand ramp is not @theme inline
chore(deps): bump radix-ui to 1.6.7
```

The scope is the component or subsystem — `button`, `registry`, `cli`, `toc`.

## Before every commit

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

All four must pass. Never weaken a rule, a type or a test to get there — if a check is wrong,
fix the check deliberately and say so in the commit body.

## Adding a component

1. Write it in `src/components/ui/`. Match the conventions already there:
   - variants in a `cva` block at the top of the file
   - `data-slot` on every rendered part
   - `data-variant` / `data-size` on the root where variants exist
   - semantic tokens only — no literal colours, no default Tailwind `blue-*` or `gray-*`
   - `className` last in `cn()`, so a caller can always override
2. Add an entry to `registry.json`, with its npm `dependencies` and `registryDependencies`.
3. Add a demo in `src/content/docs/demos/`. It is both the live preview and the code sample,
   so it must be something you would actually write.
4. Add `src/content/docs/components/<name>.mdx`. Start at `##` — the `h1` comes from the nav
   config.
5. Add it to `src/content/docs/nav.ts`. That file drives the sidebar, the ⌘K palette and the
   Previous/Next pager at once.
6. `npm run registry:build`.

## Changing design tokens

Tokens live in `src/styles/tokens.css`, which is shipped to consumer projects verbatim by
`kairo-ui init`. Anything that only makes sense on this site belongs in `globals.css` instead.

Every change there needs a matching row in `src/styles/theme.md`, recording where the value came
from. That file is how anyone later can tell an inherited value from a local decision.

Check contrast in **both** themes. A colour that passes in light mode routinely fails in dark.

## Working on the CLI

```bash
npm run registry:build
npm run cli:build
node cli/dist/index.js add button --cwd /path/to/test-project --registry ./public/r
```

Test against a real project directory, not a mock. The parts that break are alias resolution
and import rewriting, and neither is exercised by unit tests of the resolver alone.

## Style

Prettier owns formatting; ESLint owns correctness. Do not argue with either in review — run
`npm run format`.

Comments explain **why**, not what. A comment restating the code is noise; a comment recording
the constraint that forced an unusual shape is the most valuable line in the file.
