import { CheckIcon, CopyIcon } from 'lucide-react'
import { useRef } from 'react'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

export function CopyButton({
  value,
  className,
  label = 'Copy code',
}: {
  value: () => string
  className?: string
  label?: string
}) {
  const { copied, copy } = useCopyToClipboard()

  return (
    <button
      type="button"
      onClick={() => copy(value())}
      aria-label={copied ? 'Copied' : label}
      className={cn(
        'grid size-7 place-items-center rounded-md border border-border bg-background/80 text-muted-foreground opacity-0 backdrop-blur transition group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50',
        className,
      )}
    >
      {copied ? <CheckIcon className="size-3.5 text-primary" /> : <CopyIcon className="size-3.5" />}
    </button>
  )
}

/**
 * Replaces `<pre>` inside MDX. The copy button reads `textContent` off the
 * rendered node rather than being handed a source string, so it always copies
 * exactly what the reader can see — including anything shiki restructured.
 */
export function CodeBlock({ className, children, ...props }: React.ComponentProps<'pre'>) {
  const ref = useRef<HTMLPreElement>(null)

  return (
    <div className="group relative my-6">
      <pre
        ref={ref}
        className={cn(
          'max-h-[40rem] overflow-x-auto rounded-lg border border-border bg-surface-soft py-4 font-mono text-[0.8125rem] leading-relaxed',
          // rehype-pretty-code emits one [data-line] span per line; the grid
          // makes each line full-width so highlighted lines span the block.
          '[&_[data-line]]:px-4 [&>code]:grid [&>code]:min-w-full [&>code]:bg-transparent',
          className,
        )}
        {...props}
      >
        {children}
      </pre>
      <CopyButton className="absolute top-3 right-3" value={() => ref.current?.textContent ?? ''} />
    </div>
  )
}
