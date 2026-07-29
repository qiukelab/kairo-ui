import type { TocEntry } from '@/hooks/use-toc'
import { cn } from '@/lib/utils'

export function TableOfContents({
  entries,
  activeId,
}: {
  entries: TocEntry[]
  activeId: string | null
}) {
  if (entries.length === 0) return null

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 font-medium">On This Page</p>
      <ul className="space-y-2 border-l border-border">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={entry.id === activeId ? 'location' : undefined}
              className={cn(
                '-ml-px block border-l border-transparent py-0.5 text-muted-foreground transition-colors hover:text-foreground',
                entry.depth === 2 ? 'pl-4' : 'pl-8',
                entry.id === activeId && 'border-primary font-medium text-foreground',
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
