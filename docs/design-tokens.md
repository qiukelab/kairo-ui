# Design tokens

The token set, and why each decision was made. For **where the values came from**, see
[`src/styles/theme.md`](../src/styles/theme.md) — this file is the reasoning, that one is the
provenance.

Tokens live in [`src/styles/tokens.css`](../src/styles/tokens.css), which is shipped verbatim to
consumer projects by `kairo-ui init`.

## Why two blocks

```css
:root {
  --primary: oklch(0.546 0.245 262.881);
}
.dark {
  --primary: oklch(0.707 0.165 254.624);
}

@theme inline {
  --color-primary: var(--primary);
}
```

The raw value and the utility mapping are separate on purpose.

Without `inline`, Tailwind resolves `var(--primary)` once at build time and bakes the light
value into the `bg-primary` rule — the class then ignores the `.dark` override entirely. With
`inline`, the utility emits `var(--primary)` and resolution happens at use-site, which is what
makes a single class work in both themes.

## Why oklch

Every colour is `oklch(L C H)`.

Lightness in oklch is perceptual. Holding `L` fixed while rotating `H` produces colours that
genuinely look equally bright — something HSL cannot do, where `hsl(60 100% 50%)` (yellow) is
far brighter than `hsl(240 100% 50%)` (blue) at identical stated lightness.

That property is what makes the dark-mode palette tractable. The surface steps

```
--background  0.15
--card        0.19
--popover     0.22
```

are visually even because the numbers are perceptual, not because they were tuned by eye.

## The neutrals are not grey

Every neutral carries a small chroma at hue **254**:

```css
--foreground: oklch(0.16 0.008 254);
--muted-foreground: oklch(0.47 0.014 254);
--border: oklch(0.885 0.008 254);
```

`0.008` is barely perceptible in isolation, and it is the difference between an interface that
reads as _designed_ and one that reads as a Tailwind default. Pure grey next to a blue accent
looks slightly dirty; a grey carrying the accent's hue looks intentional.

**If you retint, rotate the neutrals too.** Changing only `--primary` is the most common way a
retheme ends up looking subtly wrong.

## Contrast drove the primary swap

| Mode  | `--primary`                           | Contrast on its background |
| ----- | ------------------------------------- | -------------------------- |
| Light | blue-600 `oklch(0.546 0.245 262.881)` | passes AA                  |
| Dark  | blue-400 `oklch(0.707 0.165 254.624)` | ~6.2:1 — passes AA         |

Reusing the light-mode blue in dark mode gives roughly 2.4:1, which fails. `--primary-foreground`
inverts alongside it, from near-white to the dark background value, so text on a primary surface
stays legible in both.

This is the token set's one genuinely non-obvious value, and it is the one most likely to be
broken by a well-meaning simplification.

## Depth without shadow

Shadows are close to invisible on dark surfaces. Elevation is expressed as lightness instead:

| Token          | Light          | Dark                    |
| -------------- | -------------- | ----------------------- |
| `--background` | `oklch(1 0 0)` | `oklch(0.15 0.012 254)` |
| `--card`       | `oklch(1 0 0)` | `oklch(0.19 0.014 254)` |
| `--popover`    | `oklch(1 0 0)` | `oklch(0.22 0.014 254)` |

In light mode all three are white and separation comes from borders; in dark mode the borders
recede and the lightness steps do the work.

## Translucent borders in dark mode

```css
--border: oklch(1 0 0 / 13%);
```

A fixed dark-grey border reads as a hard line on `--popover` and disappears on `--background`.
White at low alpha adapts to whatever sits beneath it, so one value works on every surface.

## Radius derives from one number

```css
--radius: 0.5rem;

--radius-sm: calc(var(--radius) * 0.6);
--radius-md: calc(var(--radius) * 0.8);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) * 1.4);
```

Changing `--radius` moves the whole interface together. `0.5rem` is flatter than shadcn's
`0.625rem` default — a crisper look, and the reference design system's choice.

## The brand ramp is deliberately not `inline`

```css
@theme {
  --color-brand-500: oklch(0.623 0.214 259.815);
  --color-brand-600: oklch(0.546 0.245 262.881);
}
```

Semantic tokens flip with the theme; these must not. They exist for decorative work — the
landing page's hero wash, gradient accents — where a hue that inverts between modes would look
like a bug.

The rule of thumb: **anything a user reads or clicks uses a semantic token.** The ramp is for
decoration only.

## Typography

```css
--font-sans: 'Noto Sans Thai', 'Inter', ui-sans-serif, system-ui, sans-serif, 'Noto Sans KR';
--font-mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', Menlo, Consolas, monospace;
```

Thai leads the stack. A font with Thai coverage first means Thai text renders from a face
designed for it, while Latin characters — which Noto Sans Thai also covers, but less
distinctively — fall through to Inter for anything Noto does not carry.

`--font-thai`, `--font-en` and `--font-ko` are also exposed individually for the cases where a
block of text is known to be single-script.

## Adding a token

1. Add the raw value to both `:root` and `.dark` in `tokens.css`.
2. Map it in `@theme inline` — otherwise there is no utility, only a variable.
3. Record it in `src/styles/theme.md`, saying where the value came from.
4. Check it in both themes before committing.

Do not add a token for a one-off. Tokens are a shared vocabulary; a `--color-marketing-hero-bg`
that appears once is a class, not a token.
