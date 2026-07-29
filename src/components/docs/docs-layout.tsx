import { DocsSidebar } from '@/components/docs/docs-sidebar'
import { SiteHeader } from '@/components/layout/site-header'

/**
 * Three columns at xl (sidebar / content / TOC), two at lg, one below that —
 * where the sidebar moves into the header's Sheet.
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
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 sm:px-6 lg:px-8">
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 lg:block">
          <DocsSidebar />
        </aside>

        <main className="min-w-0 flex-1 py-8 xl:max-w-3xl">{children}</main>

        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 xl:block">
          {toc}
        </aside>
      </div>
    </div>
  )
}
