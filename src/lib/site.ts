export const siteConfig = {
  name: 'kairo-ui',
  tagline: 'Components you own.',
  description:
    'An accessible, themeable React component library built on Tailwind CSS v4 and Radix UI. Copy the source into your project, or pull it in with the CLI.',
  github: {
    owner: 'yindeejs',
    repo: 'kairo-ui',
  },
  /** Where `kairo-ui add` fetches component definitions from. */
  registryUrl: 'https://kairo-ui.dev/r',
  version: '0.1.0',
} as const

export const githubUrl = `https://github.com/${siteConfig.github.owner}/${siteConfig.github.repo}`

export const mainNav = [
  { title: 'Docs', href: '/docs' },
  { title: 'Components', href: '/docs/components/button' },
  { title: 'Theming', href: '/docs/theming' },
] as const
