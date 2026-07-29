import { Link, useLocation } from 'react-router-dom'

import { DocsSearch } from '@/components/docs/docs-search'
import { MobileNav } from '@/components/layout/mobile-nav'
import { ModeToggle } from '@/components/layout/mode-toggle'
import { Button } from '@/components/ui/button'
import { formatStars, useGitHubStars } from '@/hooks/use-github-stars'
import { githubUrl, mainNav, siteConfig } from '@/lib/site'
import { cn } from '@/lib/utils'

function GitHubMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

/** Decorative rule between the header's groups. Purely visual, so it is hidden
 *  from assistive technology, and it collapses below `sm` where the row is
 *  already tight enough not to need the separation. */
function HeaderDivider() {
  return <span aria-hidden className="hidden h-4 w-px shrink-0 bg-border sm:block" />
}

/**
 * The mark and the count are one control, not two.
 *
 * The name comes from `aria-label` rather than from the visible digits: a link
 * announced as "120k" says nothing, and the count is absent whenever the API
 * call fails, so the label has to read correctly in both states.
 */
function GitHubLink() {
  const stars = useGitHubStars()

  return (
    <Button variant="ghost" size="sm" asChild>
      <a
        href={githubUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={
          stars === null ? 'GitHub repository' : `GitHub repository, ${formatStars(stars)} stars`
        }
      >
        <GitHubMark className="size-4" aria-hidden />
        {stars !== null && (
          <span aria-hidden className="hidden text-xs tabular-nums sm:inline">
            {formatStars(stars)}
          </span>
        )}
      </a>
    </Button>
  )
}

export function SiteHeader() {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      {/* `max-w-[120rem]` and this padding must match DocsLayout's shell. The
          header is the same edge as the sidebar and the TOC, so any drift shows
          up as the logo sitting out of line with the navigation beneath it. */}
      <div className="mx-auto flex h-14 w-full max-w-[120rem] items-center gap-2 px-4 sm:px-6 lg:px-8">
        <MobileNav />

        <Link to="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <span className="grid size-6 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            k
          </span>
          <span className="hidden sm:inline">{siteConfig.name}</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 text-sm lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground',
                pathname.startsWith(item.href) && 'text-foreground',
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <DocsSearch className="w-36 sm:w-56 lg:w-72" />
          <HeaderDivider />
          <GitHubLink />
          <HeaderDivider />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
