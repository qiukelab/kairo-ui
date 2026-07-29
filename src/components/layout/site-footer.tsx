import { Link } from 'react-router-dom'

import { githubUrl, siteConfig } from '@/lib/site'

const footerSections = [
  {
    title: 'Docs',
    links: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Theming', href: '/docs/theming' },
      { title: 'Dark Mode', href: '/docs/dark-mode' },
    ],
  },
  {
    title: 'Components',
    links: [
      { title: 'Button', href: '/docs/components/button' },
      { title: 'Card', href: '/docs/components/card' },
      { title: 'Dialog', href: '/docs/components/dialog' },
      { title: 'Tabs', href: '/docs/components/tabs' },
    ],
  },
  {
    title: 'Reference',
    links: [
      { title: 'CLI', href: '/docs/cli' },
      { title: 'kairo.json', href: '/docs/kairo-json' },
      { title: 'Registry', href: '/docs/registry' },
      { title: 'Changelog', href: '/docs/changelog' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="grid size-6 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                k
              </span>
              {siteConfig.name}
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">{siteConfig.tagline}</p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h2 className="text-sm font-semibold">{section.title}</h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Released under the MIT License. Themed from{' '}
            <span className="text-foreground">Nongmuek</span>.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href={`${githubUrl}/blob/main/LICENSE`}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              License
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
