import { useEffect, useState } from 'react'

import { CopyButton } from '@/components/docs/code-block'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// The demo that renders and the source that is displayed come from the same
// file, so the Code tab can never drift from the Preview tab.
const demoComponents = import.meta.glob('/src/content/docs/demos/*.tsx', {
  eager: true,
}) as Record<string, { default: React.ComponentType }>

const demoSources = import.meta.glob('/src/content/docs/demos/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

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

export function ComponentPreview({
  name,
  className,
  align = 'center',
}: {
  name: string
  className?: string
  align?: 'center' | 'start'
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
    <Tabs defaultValue="preview" className={cn('my-6 gap-3', className)}>
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>

      <TabsContent value="preview">
        <div
          className={cn(
            'flex min-h-56 flex-wrap items-center gap-4 rounded-lg border border-border p-8',
            align === 'center' ? 'justify-center' : 'justify-start',
          )}
        >
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
