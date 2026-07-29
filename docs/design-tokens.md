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

## Lines come in three weights

```css
--border: oklch(0.885 0.008 254); /* page structure */
--input: oklch(0.915 0.007 254); /* a control's outline */
--border-soft: oklch(0.935 0.006 254); /* a divider inside an elevated surface */
```

One token cannot do all three jobs. A line that is strong enough to organise a page — the tabs
rail, the sidebar edge — reads as clutter when it is drawn _inside_ a card, which is already
separated from the page by its shadow. Splitting them means the card divider can soften without
weakening the tabs rail, and the input outline can be tuned without touching either.

Note what this does **not** buy. Measured against `--background` in light mode:

| Value                          | Contrast on white |
| ------------------------------ | ----------------- |
| `--border` `oklch(0.885)`      | 1.42:1            |
| `--input` `oklch(0.915)`       | 1.29:1            |
| `--border-soft` `oklch(0.935)` | 1.21:1            |

None reaches WCAG 1.4.11's 3:1 for non-text contrast, and `--input` is the one that matters most:
inputs are `bg-transparent` in light mode, so their border is the only thing marking the control.
It did not pass before this ramp either — the previous value was the same `oklch(0.885)` as
`--border`, at 1.42:1. This is a deliberate house-style choice matching the wider ecosystem, not
an oversight, but it is a choice.

An interface that must clear 1.4.11 needs `--input` around `oklch(0.72)`, and should stop relying
on the outline alone — a filled `--muted` background for the control does the job without
darkening every hairline on the page.

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

In light mode all three are white and separation comes from elevation; in dark mode the shadows
recede and the lightness steps do the work.

## Elevation changes shape between themes

The point above is exactly the problem with a shadow token: a blurred shadow on a dark surface
is close to invisible, so a borderless card would lose its edge entirely. `--shadow-card`
answers that by being a _different shape_ in each theme rather than a different opacity.

```css
:root {
  --shadow-card:
    0 1px 2px -1px oklch(0.16 0.008 254 / 0.1), 0 2px 6px -1px oklch(0.16 0.008 254 / 0.06);
}

.dark {
  --shadow-card: 0 0 0 1px oklch(1 0 0 / 0.07), 0 2px 8px -2px oklch(0 0 0 / 0.6);
}
```

The dark value's first layer has zero blur and 1px spread. That is not a shadow — it is a
hairline ring, drawn through the same property, standing in for the edge the light theme gets
for free from its shadow.

Because `box-shadow` accepts both forms, `shadow-card` is a single utility that is correct in
both themes. `Card` carries no `border` class and no `dark:` variant, which is the whole point:
the theme knowledge lives in the token, not in every component that wants to look raised.

`--shadow-card-hover` is the same idea one step up, for interactive cards.

Shadow colour is the hue-254 foreground rather than pure black. Black shadows on a tinted
neutral palette look grey and slightly dirty for the same reason pure grey does — see above.

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
