import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { z } from 'zod'

import { CliError } from './logger.js'

export const CONFIG_FILE = 'kairo.json'

export const configSchema = z.object({
  $schema: z.string().optional(),
  style: z.literal('default').default('default'),
  tsx: z.boolean().default(true),
  tailwind: z.object({
    css: z.string(),
  }),
  aliases: z.object({
    components: z.string().default('@/components'),
    ui: z.string().default('@/components/ui'),
    lib: z.string().default('@/lib'),
    utils: z.string().default('@/lib/utils'),
    hooks: z.string().default('@/hooks'),
  }),
  iconLibrary: z.literal('lucide').default('lucide'),
  registry: z.string().default('https://kairo-ui.dev/r'),
})

export type Config = z.infer<typeof configSchema>

export async function readConfig(cwd: string): Promise<Config> {
  const file = path.join(cwd, CONFIG_FILE)

  let raw: string
  try {
    raw = await readFile(file, 'utf8')
  } catch {
    throw new CliError(
      `No ${CONFIG_FILE} found in ${cwd}`,
      'Run `kairo-ui init` first, or pass --cwd to point at the right directory.',
    )
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(stripBom(raw))
  } catch (error) {
    throw new CliError(`${CONFIG_FILE} is not valid JSON`, (error as Error).message)
  }

  const result = configSchema.safeParse(parsed)
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n')
    throw new CliError(`${CONFIG_FILE} is invalid`, issues)
  }

  return result.data
}

/**
 * Turn an alias like `@/components/ui` into an absolute directory, by reading
 * `paths` out of the project's tsconfig.
 *
 * This deliberately fails rather than guessing: a wrong answer here writes
 * source files into a directory the project does not import from, and the
 * failure only shows up as a confusing module-not-found much later.
 */
export async function resolveAlias(cwd: string, alias: string): Promise<string> {
  const paths = await readTsconfigPaths(cwd)

  for (const [pattern, targets] of Object.entries(paths)) {
    const prefix = pattern.replace(/\*$/, '')
    if (!alias.startsWith(prefix)) continue

    const target = targets[0]
    if (!target) continue

    const rest = alias.slice(prefix.length)
    return path.join(cwd, target.replace(/\*$/, ''), rest)
  }

  throw new CliError(
    `Could not resolve the alias "${alias}"`,
    'Add a matching entry to `compilerOptions.paths` in your tsconfig, for example {"@/*": ["./src/*"]}.',
  )
}

/** Follows `extends` and merges `paths`, nearest config winning. */
async function readTsconfigPaths(
  cwd: string,
  file = 'tsconfig.json',
  seen = new Set<string>(),
): Promise<Record<string, string[]>> {
  const absolute = path.resolve(cwd, file)
  if (seen.has(absolute)) return {}
  seen.add(absolute)

  let raw: string
  try {
    raw = await readFile(absolute, 'utf8')
  } catch {
    return {}
  }

  const config = parseJsonc(raw)
  const collected: Record<string, string[]> = {}

  // `references` is how Vite's react-ts template splits app and node configs;
  // `paths` usually lives in the referenced app config, not the root one.
  const sources: string[] = []
  if (typeof config.extends === 'string') sources.push(config.extends)
  for (const reference of config.references ?? []) {
    if (reference?.path) sources.push(reference.path)
  }

  for (const source of sources) {
    Object.assign(collected, await readTsconfigPaths(path.dirname(absolute), source, seen))
  }

  const own = config.compilerOptions?.paths
  if (own) Object.assign(collected, own)

  return collected
}

type TsconfigShape = {
  extends?: string
  references?: { path?: string }[]
  compilerOptions?: { paths?: Record<string, string[]> }
}

/**
 * A UTF-8 BOM is common in files Windows editors write, and `JSON.parse`
 * throws on it. Silently dropping it here means a project is not rejected for
 * how its editor saved the file.
 */
function stripBom(raw: string): string {
  return raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw
}

/** tsconfig files are JSONC. Strip comments and trailing commas before parsing. */
function parseJsonc(raw: string): TsconfigShape {
  const withoutComments = stripBom(raw)
    .replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (match, comment) =>
      comment ? '' : match,
    )
    .replace(/,(\s*[}\]])/g, '$1')

  try {
    return JSON.parse(withoutComments) as TsconfigShape
  } catch {
    return {}
  }
}
