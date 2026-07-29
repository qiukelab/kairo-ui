import {
  AccessibilityIcon,
  ArrowRightIcon,
  BlocksIcon,
  MoonStarIcon,
  PaletteIcon,
  TerminalIcon,
  ZapIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { CopyButton } from '@/components/docs/code-block'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { githubUrl, siteConfig } from '@/lib/site'

const features = [
  {
    icon: BlocksIcon,
    title: 'You own the code',
    description:
      'Components are copied into your repository, not installed behind a version range. Rename them, delete the props you never use, fork a variant — nothing upstream can break you.',
  },
  {
    icon: PaletteIcon,
    title: 'CSS-first tokens',
    description:
      'Tailwind CSS v4 with an @theme block and no tailwind.config.js. Every colour, radius and font is a CSS variable you can retint in one place.',
  },
  {
    icon: AccessibilityIcon,
    title: 'Accessible by construction',
    description:
      'Dialog, Tabs and Tooltip are built on Radix primitives, so focus trapping, keyboard navigation and ARIA wiring are handled before you write a line.',
  },
  {
    icon: MoonStarIcon,
    title: 'Dark mode that never flashes',
    description:
      'A class on <html>, a pre-paint script, and semantic tokens that flip together. Contrast is checked in both themes, not just the light one.',
  },
  {
    icon: TerminalIcon,
    title: 'A real CLI',
    description:
      'kairo-ui init wires up your project; kairo-ui add button writes the file and installs what it needs. Registry-driven, so dependencies resolve themselves.',
  },
  {
    icon: ZapIcon,
    title: 'No runtime to ship',
    description:
      'Class Variance Authority for variants, tailwind-merge for overrides. There is no theme provider tax and no styled-components bundle.',
  },
]

const installCommand = 'npx kairo-ui@latest init'

const usageExample = `import { Button } from "@/components/ui/button"

export function Actions() {
  return (
    <div className="flex gap-2">
      <Button>Save changes</Button>
      <Button variant="outline">Cancel</Button>
    </div>
  )
}`

export function Landing() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

      <main className="flex-1">
        <Hero />
        <Features />
        <QuickStart />
      </main>

      <SiteFooter />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Brand wash + grid. Both are decorative, hence aria-hidden and
          pointer-events-none — they must never intercept a click on the CTAs. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,var(--color-brand-500),transparent)] opacity-15 dark:opacity-25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)] bg-[size:56px_56px] opacity-60"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          {/* `soft` rather than `muted`: the hero wash is near-white, and with
              no border left to hold the shape a neutral fill disappears into
              it. The tint also signals that this pill is a link. */}
          <Badge variant="soft" size="lg" asChild className="mb-6 backdrop-blur">
            <a href={`${githubUrl}/releases`} target="_blank" rel="noreferrer">
              v{siteConfig.version} · Tailwind CSS v4 + Radix UI
              <ArrowRightIcon />
            </a>
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {siteConfig.tagline}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
            {siteConfig.description}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link to="/docs">
                Get Started
                <ArrowRightIcon />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <a href={githubUrl} target="_blank" rel="noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>

          <div className="group mx-auto mt-10 flex w-full max-w-md items-center gap-2 rounded-lg border border-border bg-background/70 py-2 pr-2 pl-4 backdrop-blur">
            <span className="text-muted-foreground select-none">$</span>
            <code className="scrollbar-none flex-1 overflow-x-auto text-left font-mono text-sm whitespace-nowrap">
              {installCommand}
            </code>
            <CopyButton
              value={() => installCommand}
              label="Copy install command"
              className="opacity-100"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Built for projects that outlive their dependencies
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          Every decision here optimises for the day you need to change something the library author
          never anticipated.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="gap-4 transition-shadow hover:shadow-card-hover">
            <CardHeader>
              <span className="mb-2 grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
                <feature.icon className="size-4.5" aria-hidden />
              </span>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription className="leading-6">{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

function QuickStart() {
  return (
    <section className="border-t border-border bg-surface-soft/40">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Two commands, then it&rsquo;s your code
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            <code className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-sm">
              init
            </code>{' '}
            writes <code className="font-mono text-sm">kairo.json</code> and your token block.{' '}
            <code className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-sm">
              add
            </code>{' '}
            drops the component source straight into your components directory and installs whatever
            it depends on.
          </p>

          <ol className="mt-8 space-y-4">
            {[
              { command: 'npx kairo-ui@latest init', label: 'Set up tokens and paths' },
              { command: 'npx kairo-ui@latest add button card', label: 'Pull in components' },
            ].map((step, index) => (
              <li key={step.command} className="flex items-start gap-4">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <div className="group min-w-0 flex-1">
                  <div className="flex items-center gap-2 rounded-md border border-border bg-background py-1.5 pr-1.5 pl-3">
                    <code className="scrollbar-none flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap">
                      {step.command}
                    </code>
                    <CopyButton value={() => step.command} label={`Copy: ${step.label}`} />
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{step.label}</p>
                </div>
              </li>
            ))}
          </ol>

          <Button variant="link" asChild className="mt-6 px-0">
            <Link to="/docs/installation">
              Read the installation guide
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>

        <div className="group relative">
          <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-border bg-background px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-destructive/60" />
            <span className="size-2.5 rounded-full bg-brand-400/60" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">actions.tsx</span>
          </div>
          <pre className="overflow-x-auto rounded-b-lg border border-border bg-background p-4 font-mono text-[0.8125rem] leading-relaxed">
            {usageExample}
          </pre>
          <CopyButton
            value={() => usageExample}
            label="Copy example"
            className="absolute top-12 right-3"
          />
        </div>
      </div>
    </section>
  )
}
