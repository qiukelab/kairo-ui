import { DocsSidebar } from '@/components/docs/docs-sidebar'
import { SiteHeader } from '@/components/layout/site-header'

/**
 * Three columns at xl (sidebar / content / TOC), two at lg, one below that —
 * where the sidebar moves into the header's Sheet.
 *
 * The shell spans the viewport rather than sitting in a centred 7xl column, so
 * the two rails reach the edges instead of floating in the middle of a wide
 * screen. `max-w-[120rem]` must match the header's — they share an edge, and a
 * disagreement shows up as the logo not lining up with the sidebar.
 *
 * Widening the shell deliberately does **not** widen the prose. `main` grows to
 * absorb the slack — which is what pushes the TOC flush right — while the
 * content inside stays capped at `max-w-3xl` and centred. Letting the text run
 * the full width would be the same mistake as zooming: more pixels used, harder
 * to read.
 */
export function DocsLayout({
  children,
  toc,
}: {
  children: React.ReactNode
  toc?: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[120rem] flex-1 gap-8 px-4 sm:px-6 lg:px-8">
        {/* The rails only widen at 2xl. Growing them at 1280 would take the
            space straight out of the content column. */}
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 lg:block 2xl:w-64">
          <DocsSidebar />
        </aside>

        <main className="min-w-0 flex-1 py-8">
          <div className="mx-auto w-full max-w-3xl">{children}</div>
        </main>

        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 xl:block 2xl:w-64">
          {toc}
        </aside>
      </div>
    </div>
  )
}
