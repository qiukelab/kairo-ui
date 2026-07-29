import { access, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { resolveAlias, type Config } from './config.js'
import { CliError } from './logger.js'
import type { RegistryItem } from './registry.js'

/** Which alias a registry target's leading segment maps to. */
const TARGET_ROOTS = {
  ui: (config: Config) => config.aliases.ui,
  lib: (config: Config) => config.aliases.lib,
  hooks: (config: Config) => config.aliases.hooks,
} satisfies Record<string, (config: Config) => string>

export type PlannedFile = {
  item: string
  absolutePath: string
  relativePath: string
  content: string
  exists: boolean
}

export async function planFiles(items: RegistryItem[], config: Config, cwd: string) {
  const planned: PlannedFile[] = []

  for (const item of items) {
    for (const file of item.files) {
      // Theme files are handled by `init`, which merges them into an existing
      // stylesheet rather than writing a standalone file.
      if (file.type === 'registry:theme') continue

      const [root, ...rest] = file.target.split('/')
      const alias = TARGET_ROOTS[root as keyof typeof TARGET_ROOTS]
      if (!alias) {
        throw new CliError(
          `"${item.name}" has an unrecognised target root "${root}"`,
          `Expected one of: ${Object.keys(TARGET_ROOTS).join(', ')}.`,
        )
      }

      const directory = await resolveAlias(cwd, alias(config))
      const absolutePath = path.join(directory, ...rest)

      planned.push({
        item: item.name,
        absolutePath,
        relativePath: path.relative(cwd, absolutePath).replaceAll('\\', '/'),
        content: rewriteImports(file.content, config),
        exists: await exists(absolutePath),
      })
    }
  }

  return planned
}

export async function writeFiles(files: PlannedFile[]) {
  for (const file of files) {
    await mkdir(path.dirname(file.absolutePath), { recursive: true })
    await writeFile(file.absolutePath, file.content, 'utf8')
  }
}

/**
 * Registry sources are written against this repository's own aliases. Rewrite
 * them to the consumer's before the file lands on disk.
 *
 * Order matters: `@/lib/utils` is a prefix-free exact specifier and must be
 * replaced before the broader `@/components/ui` rule, or a project that nests
 * one inside the other gets a half-rewritten import.
 */
function rewriteImports(content: string, config: Config): string {
  return content
    .replaceAll("'@/lib/utils'", `'${config.aliases.utils}'`)
    .replaceAll('"@/lib/utils"', `"${config.aliases.utils}"`)
    .replaceAll("'@/components/ui/", `'${config.aliases.ui}/`)
    .replaceAll('"@/components/ui/', `"${config.aliases.ui}/`)
    .replaceAll("'@/hooks/", `'${config.aliases.hooks}/`)
    .replaceAll('"@/hooks/', `"${config.aliases.hooks}/`)
}

async function exists(file: string) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}
