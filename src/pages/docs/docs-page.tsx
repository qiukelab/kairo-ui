import { MDXProvider } from '@mdx-js/react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { DocsLayout } from '@/components/docs/docs-layout'
import { DocsPager } from '@/components/docs/docs-pager'
import { mdxComponents } from '@/components/docs/mdx-components'
import { TableOfContents } from '@/components/docs/table-of-contents'
import { Button } from '@/components/ui/button'
import { findDocsNavItem, hrefToSlug } from '@/content/docs/nav'
import { useToc } from '@/hooks/use-toc'

const docsModules = import.meta.glob('/src/content/docs/**/*.mdx') as Record<
  string,
  () => Promise<{ default: React.ComponentType }>
>

type Loaded = { slug: string; Component: React.ComponentType }

export function DocsPage() {
  const { pathname } = useLocation()
  const slug = hrefToSlug(pathname)
  const navItem = findDocsNavItem(pathname)
  const loader = docsModules[`/src/content/docs/${slug}.mdx`]

  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [failed, setFailed] = useState<string | null>(null)
  const articleRef = useRef<HTMLDivElement>(null)

  // The loaded chunk is tagged with the slug it belongs to, so switching pages
  // clears the old content by derivation rather than by a synchronous reset in
  // an effect — which would cascade an extra render on every navigation.
  const Content = loaded?.slug === slug ? loaded.Component : null
  const missing = !loader || failed === slug

  // Loaded explicitly rather than with React.lazy so `Content` is a real
  // dependency: the TOC scan below must run on the commit that first paints the
  // headings, and Suspense gives no such signal.
  useEffect(() => {
    if (!loader) return

    let cancelled = false
    void loader()
      .then((module) => {
        if (!cancelled) setLoaded({ slug, Component: module.default })
      })
      .catch(() => {
        if (!cancelled) setFailed(slug)
      })

    return () => {
      cancelled = true
    }
  }, [loader, slug])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  const { entries, activeId } = useToc(articleRef, [Content])

  return (
    <DocsLayout toc={<TableOfContents entries={entries} activeId={activeId} />}>
      {missing ? (
        <NotFound />
      ) : (
        <article>
          {navItem && (
            <header className="mb-8">
              <p className="mb-2 text-sm font-medium text-primary">{navItem.group}</p>
              <h1 className="text-3xl font-bold tracking-tight">{navItem.title}</h1>
              <p className="mt-2 text-base text-muted-foreground">{navItem.description}</p>
            </header>
          )}

          <div ref={articleRef}>
            {Content ? (
              <MDXProvider components={mdxComponents}>
                <Content />
              </MDXProvider>
            ) : (
              <LoadingSkeleton />
            )}
          </div>

          <DocsPager pathname={pathname} />
        </article>
      )}
    </DocsLayout>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="h-4 animate-pulse rounded bg-surface-soft"
          style={{ width: `${[92, 74, 88, 60, 80][index]}%` }}
        />
      ))}
    </div>
  )
}

function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 text-muted-foreground">That documentation page doesn&rsquo;t exist yet.</p>
      <Button asChild className="mt-6">
        <Link to="/docs">Back to the docs</Link>
      </Button>
    </div>
  )
}
