# Theme provenance

Where every value in [`tokens.css`](./tokens.css) came from, so a future reader can tell what
was inherited from the reference design system and what was decided here.

## The reference

**Repository:** `qiukelab/Nongmuek` (private)
**Read on:** 2026-07-29, at commit reachable from `main` (pushed 2026-07-27)
**Method:** individual files read over the GitHub API (`gh api repos/.../contents/<path>`). The
repository was **not** cloned, and no file from it exists in this repository.

### What Nongmuek actually is

A pnpm monorepo, not the single Tailwind app the brief assumed:

| Path                                    | Stack                                                                      |
| --------------------------------------- | -------------------------------------------------------------------------- |
| `apps/web`, `apps/admin`, `apps/studio` | React + TanStack Router + Tailwind v4                                      |
| `apps/api`                              | TypeScript service                                                         |
| `apps/mobile/android`                   | Kotlin / Jetpack Compose                                                   |
| `apps/mobile/ios`                       | Swift                                                                      |
| `packages/ui`                           | Shared shadcn-based component package — **the source of everything below** |

Two assumptions in the original brief did not hold, and the steps changed accordingly:

1. **There is no `tailwind.config.*` to read.** Nongmuek is already on Tailwind v4 with
   CSS-first configuration, so the tokens were lifted from `packages/ui/src/styles.css`
   directly rather than translated from a v3 `theme.extend` block.
2. **The component layer is shadcn `new-york`.** `packages/ui/components.json` declares it, so
   the patterns below are conventions of that style as Nongmuek applies them, not inventions of
   either project.

## Colour

Values are copied exactly. The distinguishing choice is the **hue of 254** carried through the
neutrals — they are not grey, they are very slightly blue, which is what stops the palette
reading as stock Tailwind.

| Token            | Light                        | Dark                               | Source   |
| ---------------- | ---------------------------- | ---------------------------------- | -------- |
| `--background`   | `oklch(1 0 0)`               | `oklch(0.15 0.012 254)`            | Nongmuek |
| `--foreground`   | `oklch(0.16 0.008 254)`      | `oklch(0.96 0.006 254)`            | Nongmuek |
| `--card`         | `oklch(1 0 0)`               | `oklch(0.19 0.014 254)`            | Nongmuek |
| `--popover`      | `oklch(1 0 0)`               | `oklch(0.22 0.014 254)`            | Nongmuek |
| `--primary`      | `oklch(0.546 0.245 262.881)` | `oklch(0.707 0.165 254.624)`       | Nongmuek |
| `--secondary`    | `oklch(0.965 0.006 254)`     | `oklch(0.24 0.014 254)`            | Nongmuek |
| `--muted`        | `oklch(0.965 0.006 254)`     | `oklch(0.24 0.014 254)`            | Nongmuek |
| `--accent`       | `oklch(0.955 0.008 254)`     | `oklch(0.27 0.016 254)`            | Nongmuek |
| `--destructive`  | `oklch(0.577 0.245 27.325)`  | `oklch(0.704 0.191 22.216)`        | Nongmuek |
| `--border`       | `oklch(0.885 0.008 254)`     | `oklch(1 0 0 / 13%)`               | Nongmuek |
| `--input`        | `oklch(0.885 0.008 254)`     | `oklch(1 0 0 / 17%)`               | Nongmuek |
| `--ring`         | `oklch(0.646 0.142 253.92)`  | `oklch(0.707 0.165 254.624 / 60%)` | Nongmuek |
| `--surface-soft` | `oklch(0.965 0.015 254)`     | `oklch(0.22 0.02 254)`             | Nongmuek |

`--primary` is blue-600 in light mode and blue-400 in dark. That swap is Nongmuek's, and its
comment records the reason: blue-600 reaches only ~2.4:1 against the dark background, while
blue-400 clears AA at ~6.2:1. `--primary-foreground` inverts to match.

## Typography

| Token         | Value                                                                             | Source         |
| ------------- | --------------------------------------------------------------------------------- | -------------- |
| `--font-sans` | `'Noto Sans Thai', 'Inter', ui-sans-serif, system-ui, sans-serif, 'Noto Sans KR'` | Nongmuek       |
| `--font-thai` | `'Noto Sans Thai', …`                                                             | Nongmuek       |
| `--font-en`   | `'Inter', …`                                                                      | Nongmuek       |
| `--font-ko`   | `'Noto Sans KR', …`                                                               | Nongmuek       |
| `--font-mono` | `'JetBrains Mono', ui-monospace, …`                                               | **Added here** |

Nongmuek defines no monospace token. This is a documentation site with code on nearly every
page, so one was added; it joins the same Google Fonts request, costing no extra round trip.

## Radius

`--radius: 0.5rem`, from Nongmuek — deliberately tighter than shadcn's `0.625rem` default, with
`--radius-sm/md/lg/xl` derived through `calc()`. The derivation is Nongmuek's too.

## Added here, not inherited

| Addition                 | Why                                                                                                                                                                                                                                                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--color-brand-50 … 950` | Nongmuek has no ramp — its accent is a single value. The landing page needs gradients, so the ramp extends Nongmuek's two anchors (blue-600 light, blue-400 dark) across Tailwind's full blue scale in oklch. Declared in a plain `@theme`, not `@theme inline`, so decorative hues do not flip with the mode. |
| `--font-mono`            | See above.                                                                                                                                                                                                                                                                                                     |

## Not carried over

Nongmuek's stylesheet contains rules tied to its own application shell that would be noise
here, and they were left behind:

- The `html:has([data-slot="sidebar-wrapper"])` scrollbar-gutter exception, which exists for its
  admin and studio apps.
- The `body[data-scroll-locked]` margin reset, which compensates for a specific
  `react-remove-scroll-bar` behaviour in its layout.
- `SplashScreen` animations and the `.splash-*` classes.
- `:lang(ko)` font switching — kairo-ui has no Korean surface.

`scrollbar-gutter: stable`, the thin-scrollbar rules, the `prefers-reduced-motion` block, the
`* { border-color: var(--border) }` reset and the `@utility scrollbar-none` **were** carried
over, in [`globals.css`](./globals.css). They are generically useful rather than app-specific.

## Component patterns

Structure and conventions were reproduced; no file was copied.

| Pattern      | Nongmuek                                                      | Here |
| ------------ | ------------------------------------------------------------- | ---- |
| Variants     | `cva` at the top of the file                                  | Same |
| Slots        | `data-slot` on every part                                     | Same |
| Variant echo | `data-variant` / `data-size` on the root                      | Same |
| Polymorphism | `asChild` via `Slot.Root` from the unified `radix-ui` package | Same |
| Merge helper | `cn()` = `twMerge(clsx(...))`                                 | Same |
| Icon sizing  | `[&_svg:not([class*='size-'])]:size-4`                        | Same |

Button's variant and size matrices, Card's seven slots and Badge's variant list follow
Nongmuek's shape closely, because that shape is the shadcn `new-york` convention both projects
are implementing. Everything else — the docs system, the registry, the CLI, the landing page —
is original to this repository.

## Licensing

No source file, asset or string from `Nongmuek` is committed here. What was taken is design
values (colour, radius, font stacks) and structural conventions that originate in shadcn/ui,
which is MIT-licensed.
