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
 * content inside stays capped at `max-w-[40rem]` and centred. Letting the text
 * run the full width would be the same mistake as zooming: more pixels used,
 * harder to read.
 *
 * Nothing reaches into that slack, deliberately. A preview that broke out of
 * the column was tried and removed: it made every example a different width
 * from the paragraph explaining it, and the reader's eye had to re-find the
 * left edge on each one. A table too wide for the column scrolls inside its
 * own container instead — see `Table`.
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
            space straight out of the content column.

            `-ml-3` cancels the items' own `px-3` so the menu text lines up with
            the logo above it rather than sitting 12px inside. It is safe on the
            scroll container itself — margins sit outside the scrollport, so
            nothing clips; the same value on the nav *inside* would cut the left
            edge off every hover pill.

            `scrollbar-gutter: stable` reserves the track whether or not this
            list overflows, for the reason already given for the page scrollbar
            in globals.css: otherwise the whole column jumps sideways between a
            short page and a long one. `pr-2` then keeps the hover pill from
            running underneath the scrollbar. */}
        <aside className="sticky top-14 -ml-3 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 [scrollbar-gutter:stable] overflow-y-auto py-8 pr-2 lg:block 2xl:w-64">
          <DocsSidebar />
        </aside>

        <main className="min-w-0 flex-1 py-8">
          {/* 40rem, not a scale token: it is the reading measure taken off the
              reference design, and 768px made the same 16px type read as
              oversized because the lines were 20% longer. Tables and code
              blocks bring their own `overflow-x-auto`, so nothing clips. */}
          <div className="mx-auto w-full max-w-[40rem]">{children}</div>
        </main>

        {/* Same reserved gutter as the sidebar: this list scrolls on a long
            page and not on a short one, and without it the headings reflow as
            you move between them. No `-ml-3` — the TOC's own left rule is the
            alignment here, not the item padding. */}
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 [scrollbar-gutter:stable] overflow-y-auto py-8 pr-2 xl:block 2xl:w-64">
          {toc}
        </aside>
      </div>
    </div>
  )
}
