import { useEffect, useState } from 'react'

export type TocEntry = {
  id: string
  text: string
  depth: 2 | 3
}

/**
 * Build the "On This Page" list from what was actually rendered, rather than
 * from a remark pass over the source. rehype-slug has already put an id on
 * every heading, so the DOM is the single source of truth and can't drift from
 * the visible page.
 *
 * `deps` re-runs the scan when the route changes; the MDX chunk is lazy, so the
 * headings do not exist on the first render after a navigation.
 */
export function useToc(containerRef: React.RefObject<HTMLElement | null>, deps: unknown[] = []) {
  const [entries, setEntries] = useState<TocEntry[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const headings = Array.from(container.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]'))
    setEntries(
      headings.map((heading) => ({
        id: heading.id,
        text: heading.textContent ?? '',
        depth: heading.tagName === 'H2' ? 2 : 3,
      })),
    )
    setActiveId(headings[0]?.id ?? null)

    if (headings.length === 0) return

    // Track every heading's intersection state ourselves instead of reacting to
    // single entries: the callback only reports headings that *changed*, so
    // picking "the first visible one" from `entries` alone flickers on fast
    // scrolls. The top margin offsets the sticky header.
    const visible = new Map<string, boolean>()
    const observer = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          visible.set(entry.target.id, entry.isIntersecting)
        }
        const firstVisible = headings.find((heading) => visible.get(heading.id))
        if (firstVisible) {
          setActiveId(firstVisible.id)
          return
        }
        // Nothing in the band (a long section) — the last heading scrolled past
        // the top is still the section being read.
        const lastPassed = [...headings]
          .reverse()
          .find((heading) => heading.getBoundingClientRect().top < 120)
        if (lastPassed) setActiveId(lastPassed.id)
      },
      { rootMargin: '-100px 0px -70% 0px', threshold: 0 },
    )

    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, ...deps])

  return { entries, activeId }
}
