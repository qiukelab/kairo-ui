import type { MDXComponents } from 'mdx/types'
import { Link } from 'react-router-dom'

import { Callout } from '@/components/docs/callout'
import { CodeBlock } from '@/components/docs/code-block'
import { ComponentPreview } from '@/components/docs/component-preview'
import { cn } from '@/lib/utils'

/**
 * Every element MDX can emit is styled here rather than by a prose plugin, so
 * headings, tables and code all read from the same tokens the components use.
 *
 * `h1` is deliberately absent: the page title comes from the nav config and is
 * rendered by DocsLayout, so MDX files start at `##`.
 */
export const mdxComponents: MDXComponents = {
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        'mt-12 mb-4 scroll-m-20 border-b border-border pb-2 text-2xl font-semibold tracking-tight first:mt-0',
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn('mt-8 mb-3 scroll-m-20 text-xl font-semibold tracking-tight', className)}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn('mt-6 mb-2 scroll-m-20 text-base font-semibold tracking-tight', className)}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p className={cn('my-4 leading-7 text-foreground/90', className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn('my-4 ml-6 list-disc space-y-2 marker:text-border', className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn('my-4 ml-6 list-decimal space-y-2 marker:text-muted-foreground', className)}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn('leading-7 text-foreground/90', className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn('my-6 border-l-2 border-primary pl-6 text-muted-foreground italic', className)}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn('my-10 border-border', className)} {...props} />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn('font-semibold text-foreground', className)} {...props} />
  ),
  a: ({ className, href = '', ...props }) => {
    const style = cn(
      'font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary',
      className,
    )
    // Router links keep docs navigation client-side; anchors and external URLs
    // must stay real <a> elements.
    if (href.startsWith('/')) {
      return <Link to={href} className={style} {...props} />
    }
    const external = href.startsWith('http')
    return (
      <a
        href={href}
        className={style}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        {...props}
      />
    )
  },
  table: ({ className, ...props }) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border border-border">
      <table className={cn('w-full border-collapse text-sm', className)} {...props} />
    </div>
  ),
  thead: ({ className, ...props }) => (
    <thead className={cn('bg-surface-soft', className)} {...props} />
  ),
  tr: ({ className, ...props }) => (
    <tr className={cn('border-b border-border last:border-0', className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th className={cn('px-4 py-2.5 text-left font-semibold', className)} {...props} />
  ),
  td: ({ className, ...props }) => (
    <td className={cn('px-4 py-2.5 align-top text-foreground/90', className)} {...props} />
  ),
  img: ({ className, alt = '', ...props }) => (
    <img className={cn('my-6 rounded-lg border border-border', className)} alt={alt} {...props} />
  ),
  pre: CodeBlock,
  code: ({ className, ...props }: React.ComponentProps<'code'> & { 'data-language'?: string }) => {
    // rehype-pretty-code stamps data-language on fenced blocks. Those are
    // already wrapped by CodeBlock and must not get the inline chip styling.
    if (props['data-language']) {
      return <code className={className} {...props} />
    }
    return (
      <code
        className={cn(
          'rounded border border-border bg-surface-soft px-1.5 py-0.5 font-mono text-[0.8125rem] break-words',
          className,
        )}
        {...props}
      />
    )
  },
  Callout,
  ComponentPreview,
}
