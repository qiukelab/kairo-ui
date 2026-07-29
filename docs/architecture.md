# Architecture

Three subsystems share one repository: the component library, the documentation site, and the
distribution mechanism. They are coupled on purpose — the site builds the registry, so a
component cannot be documented without also being installable.

## Build pipeline

```
registry.json ──► scripts/build-registry.mjs ──► public/r/*.json ──┐
                                                                    │ copied verbatim
src/**/*.tsx ──┐                                                    ▼
               ├──► tsc -b ──► vite build ──────────────────────► dist/
src/**/*.mdx ──┘        (mdx → jsx → shiki → React)
```

`npm run build` is `registry:build && tsc -b && vite build`. The ordering is the guarantee: the
registry is regenerated from the current component sources before anything is bundled.

## Vite plugin order

```ts
plugins: [
  { enforce: 'pre', ...mdx({ … }) },
  react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  tailwindcss(),
]
```

MDX must run first — it compiles `.mdx` to JSX, which the React plugin then transforms. The
widened `include` is what gives MDX pages Fast Refresh; without it, editing a docs page reloads
the whole window.

## Routing

React Router with a single catch-all:

```tsx
<Route path="/" element={<Landing />} />
<Route path="/docs/*" element={<DocsPage />} />
<Route path="*" element={<DocsPage />} />
```

`DocsPage` resolves the slug against `import.meta.glob('/src/content/docs/**/*.mdx')` and
renders its own 404 when nothing matches. There is no route table to keep in sync with the
filesystem.

The spec for this project described `src/pages/docs/[slug].tsx`. That is a Next.js file-routing
convention with no meaning under React Router, so the file is `docs-page.tsx` and the wildcard
lives in `App.tsx`.

## Why the MDX module is loaded explicitly

`DocsPage` uses `useEffect` + dynamic `import()` rather than `React.lazy` + `Suspense`:

```tsx
const [Content, setContent] = useState<React.ComponentType | null>(null)
```

The table of contents scans the rendered DOM for headings. That scan has to run on the commit
that first paints them, and Suspense provides no such signal — `Content` transitioning from
`null` to a component is exactly that signal, and it is a legitimate effect dependency.

## Table of contents

`useToc` reads `h2[id], h3[id]` out of the rendered article rather than extracting headings from
the MDX AST with a remark plugin. rehype-slug has already assigned the ids, so the DOM is the
single source of truth and cannot drift from what the reader sees.

Scrollspy tracks **every** heading's intersection state in a `Map` rather than reacting to
individual `IntersectionObserver` entries. The callback only reports headings whose state
_changed_, so choosing "the first visible entry" from the callback argument alone flickers
during fast scrolling. When nothing is inside the observation band — a long section — the last
heading above the fold stays active.

## Navigation config

`src/content/docs/nav.ts` is the single source of truth for ordering. The sidebar, the ⌘K
palette and the Previous/Next pager all derive from it, so they cannot disagree about what
exists or what comes next. Page titles and descriptions live there too, which is why MDX files
start at `##`.

## Theming

Two layers, in `src/styles/tokens.css`:

1. Raw values on `:root`, overridden on `.dark`.
2. `@theme inline` mappings that turn each into a Tailwind utility.

`inline` matters: it makes `bg-primary` resolve `var(--primary)` at the point of use, so the
utility follows the `.dark` override instead of freezing the light value at build time.

The static `brand-*` ramp is in a plain `@theme` block, deliberately — decorative gradient hues
must not flip with the mode.

`tokens.css` is separate from `globals.css` because the registry ships it verbatim to consumer
projects. Anything site-specific — shiki colour switching, scrollbar rules, the
`scrollbar-none` utility — stays in `globals.css`.

## Syntax highlighting, twice

| Where                         | When               | How                                      |
| ----------------------------- | ------------------ | ---------------------------------------- |
| MDX fenced blocks             | Build time         | `rehype-pretty-code` in the MDX pipeline |
| `<ComponentPreview>` code tab | Runtime, on demand | `src/lib/highlight.ts`                   |

Both emit `--shiki-light` / `--shiki-dark` custom properties, and `globals.css` switches between
them — one CSS rule serves both paths.

The runtime highlighter is built from `shiki/core` with exactly one grammar, two themes and the
JavaScript regex engine. Importing `shiki` directly pulls every bundled language: that produced
about 200 lazy chunks and a 600 kB WASM blob in `dist/`. The fine-grained build brings it to two
chunks and no WASM.

## Registry and CLI

`registry.json` is hand-maintained; `public/r/` is generated. The builder validates the
dependency graph before writing anything, so a dangling `registryDependencies` name fails the
build here rather than 404-ing during someone else's `add`.

`resolveItems` walks the graph depth-first with a `visited` set — that set is what makes a cycle
terminate and what collapses the diamond case (two components both needing `utils`) into one
fetch. Results come back dependencies-first, so writing in order never leaves a component on
disk whose imports are unsatisfied.

Writing a file is three lookups: registry `target` → `kairo.json` alias → `tsconfig` `paths`.
The CLI fails loudly when the last step finds nothing, because guessing puts source files in a
directory the project does not import from and the error surfaces much later as a confusing
module-not-found.

## Dark mode

A `dark` class on `<html>`, applied by a synchronous script in `index.html` before any
stylesheet loads, then kept in sync by `ThemeProvider`. The script is wrapped in `try` because
`localStorage` **throws** on access in some privacy modes — an uncaught throw there runs before
the app bundle and would ship a blank page.

State is three-valued (`light` / `dark` / `system`). `resolvedTheme` is what is on screen and is
never `system`; the toggle reads it, because a user on `system` in the dark expects one click to
produce light.

## Testing

Vitest with jsdom. `src/test/setup.ts` stubs `matchMedia`, `IntersectionObserver`,
`ResizeObserver` and `fetch` — none of which jsdom implements, and all of which the components
reach for during render. `fetch` rejects rather than resolving, so `GitHubStars` exercises its
real failure path instead of depending on api.github.com being up.
