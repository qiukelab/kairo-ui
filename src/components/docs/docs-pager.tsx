import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { getPagerLinks } from '@/content/docs/nav'

export function DocsPager({ pathname }: { pathname: string }) {
  const { previous, next } = getPagerLinks(pathname)

  if (!previous && !next) return null

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-between border-t border-border pt-6"
    >
      {previous ? (
        <Button variant="outline" asChild>
          <Link to={previous.href}>
            <ChevronLeftIcon />
            {previous.title}
          </Link>
        </Button>
      ) : (
        <span />
      )}

      {next && (
        <Button variant="outline" asChild className="ml-auto">
          <Link to={next.href}>
            {next.title}
            <ChevronRightIcon />
          </Link>
        </Button>
      )}
    </nav>
  )
}
