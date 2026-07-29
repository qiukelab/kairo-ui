import { useEffect, useState } from 'react'

import { CopyButton } from '@/components/docs/code-block'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// The demo that renders and the source that is displayed come from the same
// file, so the Code tab can never drift from the Preview tab.
//
// Tests are excluded explicitly. This glob is **eager**, so a co-located
// `*.test.tsx` — which is where this repo puts tests, right beside the thing
// they test — gets imported into the browser bundle, and its top-level
// `describe()` throws before anything renders. It takes the whole docs site
// down, and neither the build nor the test run notices.
// The patterns are repeated rather than shared through a constant: this is a
// compile-time transform, and Vite rejects anything but a literal here.
const demoComponents = import.meta.glob(
  ['/src/content/docs/demos/*.tsx', '!/src/content/docs/demos/*.test.tsx'],
  { eager: true },
) as Record<string, { default: React.ComponentType }>

const demoSources = import.meta.glob(
  ['/src/content/docs/demos/*.tsx', '!/src/content/docs/demos/*.test.tsx'],
  { eager: true, query: '?raw', import: 'default' },
) as Record<string, string>

function demoPath(name: string) {
  return `/src/content/docs/demos/${name}.tsx`
}

/** Drop the import block — the docs already say where these come from. */
function trimSource(source: string) {
  return source
    .split('\n')
    .filter((line) => !line.startsWith('import '))
    .join('\n')
    .trim()
}

/**
 * How far a `wide` preview reaches past the reading column, per side.
 *
 * The prose column is 640px centred in a much wider `main`, and these claim
 * some of that slack. Every value is under the space actually measured between
 * the column and the rails — 65px at xl, 161px at 2xl, 353px at 1920 — so the
 * preview can never reach the sidebar or the table of contents. Below xl the
 * TOC is hidden and the column is already tight, so nothing happens and the
 * table's own `overflow-x-auto` does the work instead.
 *
 * These are tied to the rail widths in docs-layout. If those change, so must
 * these — which is why the browser check measures the remaining gap rather
 * than looking at a screenshot.
 */
const WIDE = '-mx-10 2xl:-mx-32 3xl:-mx-72'

export function ComponentPreview({
  name,
  className,
  wide = false,
}: {
  name: string
  className?: string
  /** Let the preview reach past the reading column. For tables, mostly. */
  wide?: boolean
}) {
  const Demo = demoComponents[demoPath(name)]?.default
  const source = demoSources[demoPath(name)]

  if (!Demo || source === undefined) {
    return (
      <p className="my-6 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
        Missing demo <code className="font-mono">{name}</code>.
      </p>
    )
  }

  const code = trimSource(source)

  return (
    // The breakout is on the whole block, not just the preview pane, so the
    // tab rail and the code panel stay aligned with the frame above them.
    <Tabs defaultValue="preview" className={cn('my-6 gap-3', wide && WIDE, className)}>
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>

      <TabsContent value="preview">
        {/* Always centred. There used to be an `align` prop, and 18 examples
            opted into `start` — which left every one of them 191px off-centre
            in a 768px pane. A demo is a specimen, not page copy; it belongs in
            the middle of its frame. */}
        <div className="flex min-h-40 flex-wrap items-center justify-center gap-4 rounded-lg border border-border p-6">
          <Demo />
        </div>
      </TabsContent>

      <TabsContent value="code">
        <HighlightedSource code={code} />
      </TabsContent>
    </Tabs>
  )
}

function HighlightedSource({ code }: { code: string }) {
  const [html, setHtml] = useState<string | null>(null)

  // The highlighter is a separate chunk, fetched the first time any Code tab is
  // rendered and reused after that.
  useEffect(() => {
    let cancelled = false
    void import('@/lib/highlight')
      .then(({ highlightTsx }) => highlightTsx(code))
      .then((result) => {
        if (!cancelled) setHtml(result)
      })
      .catch(() => {
        // Leave the plain-text fallback in place.
      })
    return () => {
      cancelled = true
    }
  }, [code])

  const shell =
    'max-h-[40rem] overflow-x-auto rounded-lg border border-border bg-surface-soft p-4 font-mono text-[0.8125rem] leading-relaxed'

  return (
    <div className="group relative">
      {html ? (
        <div
          // Input is this repo's own demo source, read at build time by
          // import.meta.glob — never user- or network-supplied.
          dangerouslySetInnerHTML={{ __html: html }}
          className={cn(shell, '[&_pre]:!bg-transparent [&_pre]:focus-visible:outline-none')}
        />
      ) : (
        <pre className={shell}>{code}</pre>
      )}
      <CopyButton className="absolute top-3 right-3" value={() => code} />
    </div>
  )
}
