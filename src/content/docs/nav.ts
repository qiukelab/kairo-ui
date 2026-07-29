export type DocsNavItem = {
  title: string
  href: string
  /** Shown under the page title and in the command palette. */
  description: string
  label?: 'New' | 'Updated'
}

export type DocsNavGroup = {
  title: string
  items: DocsNavItem[]
}

/**
 * The single source of truth for docs ordering.
 *
 * The sidebar, the ⌘K palette and the Previous/Next pager all derive from this
 * array, so they can never disagree about what exists or what comes next. Each
 * `href` maps to `src/content/docs/<path>.mdx` (`/docs` → `index.mdx`).
 */
export const docsNav: DocsNavGroup[] = [
  {
    title: 'Get Started',
    items: [
      {
        title: 'Introduction',
        href: '/docs',
        description: 'What kairo-ui is, and why it hands you the source instead of a package.',
      },
      {
        title: 'Installation',
        href: '/docs/installation',
        description: 'Add kairo-ui to a Vite, Next.js or Remix project.',
      },
      {
        title: 'kairo.json',
        href: '/docs/kairo-json',
        description: 'The project config the CLI reads to know where your code lives.',
      },
      {
        title: 'CLI',
        href: '/docs/cli',
        description: 'init, add and list — the commands that write components into your repo.',
      },
      {
        title: 'Theming',
        href: '/docs/theming',
        description: 'Design tokens, the @theme block, and how to make kairo-ui yours.',
      },
      {
        title: 'Dark Mode',
        href: '/docs/dark-mode',
        description: 'Class-based dark mode with no flash on first paint.',
      },
    ],
  },
  {
    title: 'Components',
    items: [
      {
        title: 'Accordion',
        href: '/docs/components/accordion',
        description: 'Stacked sections that expand one at a time, or several.',
        label: 'New',
      },
      {
        title: 'Alert',
        href: '/docs/components/alert',
        description: 'A message that announces itself the moment it appears.',
        label: 'New',
      },
      {
        title: 'Alert Dialog',
        href: '/docs/components/alert-dialog',
        description: 'A modal that interrupts to confirm something irreversible.',
        label: 'New',
      },
      {
        title: 'Aspect Ratio',
        href: '/docs/components/aspect-ratio',
        description: 'Reserves space at a ratio you only know at runtime.',
        label: 'New',
      },
      {
        title: 'Attachment',
        href: '/docs/components/attachment',
        description: 'File cards and rows, with a drop target and upload states.',
        label: 'New',
      },
      {
        title: 'Avatar',
        href: '/docs/components/avatar',
        description: 'A user image with a fallback, a status badge and overlapping groups.',
        label: 'New',
      },
      {
        title: 'Button',
        href: '/docs/components/button',
        description: 'Six variants, eight sizes, and `asChild` for rendering as any element.',
      },
      {
        title: 'Card',
        href: '/docs/components/card',
        description: 'A container with header, content, footer and action slots.',
      },
      {
        title: 'Badge',
        href: '/docs/components/badge',
        description: 'A compact label for status, counts and metadata.',
      },
      {
        title: 'Input',
        href: '/docs/components/input',
        description: 'A text field wired to the focus and invalid-state tokens.',
      },
      {
        title: 'Field',
        href: '/docs/components/field',
        description: 'Label, description and error around a control — wired up for you.',
        label: 'New',
      },
      {
        title: 'Input Group',
        href: '/docs/components/input-group',
        description: 'Icons, prefixes and buttons inside the input border.',
        label: 'New',
      },
      {
        title: 'Button Group',
        href: '/docs/components/button-group',
        description: 'Adjacent controls joined into a single unit.',
        label: 'New',
      },
      {
        title: 'Dialog',
        href: '/docs/components/dialog',
        description: 'A modal window layered over the page, with focus trapping.',
      },
      {
        title: 'Dropdown Menu',
        href: '/docs/components/dropdown-menu',
        description: 'A menu of actions, with checkboxes, radios and sub-menus.',
        label: 'New',
      },
      {
        title: 'Tabs',
        href: '/docs/components/tabs',
        description: 'Layered sections of content, shown one panel at a time.',
      },
      {
        title: 'Tooltip',
        href: '/docs/components/tooltip',
        description: 'A hint that appears on hover or keyboard focus.',
      },
    ],
  },
  {
    title: 'Reference',
    items: [
      {
        title: 'Registry',
        href: '/docs/registry',
        description: 'How component definitions are published and resolved.',
      },
      {
        title: 'Changelog',
        href: '/docs/changelog',
        description: 'Notable changes, newest first.',
      },
    ],
  },
]

export type FlatDocsNavItem = DocsNavItem & { group: string }

/** Reading order, used by the pager and the command palette. */
export const docsNavFlat: FlatDocsNavItem[] = docsNav.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.title })),
)

export function findDocsNavItem(pathname: string): FlatDocsNavItem | undefined {
  return docsNavFlat.find((item) => item.href === normalizeDocsPath(pathname))
}

export function getPagerLinks(pathname: string) {
  const index = docsNavFlat.findIndex((item) => item.href === normalizeDocsPath(pathname))
  if (index === -1) return { previous: undefined, next: undefined }
  return {
    previous: index > 0 ? docsNavFlat[index - 1] : undefined,
    next: index < docsNavFlat.length - 1 ? docsNavFlat[index + 1] : undefined,
  }
}

/** `/docs/theming/` and `/docs/theming` are the same page. */
export function normalizeDocsPath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

/** `/docs` → `index`, `/docs/components/button` → `components/button`. */
export function hrefToSlug(href: string): string {
  const slug = normalizeDocsPath(href).replace(/^\/docs\/?/, '')
  return slug === '' ? 'index' : slug
}
