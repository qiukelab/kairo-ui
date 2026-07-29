import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { z } from 'zod'

import { CliError } from './logger.js'

export const registryFileSchema = z.object({
  path: z.string(),
  target: z.string(),
  type: z.string(),
  content: z.string(),
})

export const registryItemSchema = z.object({
  name: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()).default([]),
  registryDependencies: z.array(z.string()).default([]),
  files: z.array(registryFileSchema).default([]),
})

export const registryIndexSchema = z.object({
  name: z.string(),
  homepage: z.string().optional(),
  items: z.array(
    registryItemSchema.omit({ files: true }).extend({ files: z.undefined().optional() }),
  ),
})

export type RegistryItem = z.infer<typeof registryItemSchema>
export type RegistryIndexItem = z.infer<typeof registryIndexSchema>['items'][number]

function isLocal(registry: string) {
  return registry.startsWith('.') || registry.startsWith('/') || /^[a-zA-Z]:[\\/]/.test(registry)
}

async function fetchJson(registry: string, file: string, cwd: string): Promise<unknown> {
  if (isLocal(registry)) {
    const absolute = path.resolve(cwd, registry, file)
    try {
      return JSON.parse(await readFile(absolute, 'utf8'))
    } catch {
      throw new CliError(`Could not read ${absolute}`, 'Run `npm run registry:build` first.')
    }
  }

  const url = `${registry.replace(/\/$/, '')}/${file}`
  let response: Response
  try {
    response = await fetch(url)
  } catch (error) {
    throw new CliError(`Could not reach ${url}`, (error as Error).message)
  }

  if (!response.ok) {
    throw new CliError(`${url} responded ${response.status}`)
  }

  return response.json()
}

export async function fetchIndex(registry: string, cwd: string) {
  const parsed = registryIndexSchema.safeParse(await fetchJson(registry, 'index.json', cwd))
  if (!parsed.success) {
    throw new CliError('The registry index is malformed', parsed.error.issues[0]?.message)
  }
  return parsed.data
}

export async function fetchItem(registry: string, name: string, cwd: string) {
  const parsed = registryItemSchema.safeParse(await fetchJson(registry, `${name}.json`, cwd))
  if (!parsed.success) {
    throw new CliError(
      `The registry entry for "${name}" is malformed`,
      parsed.error.issues[0]?.message,
    )
  }
  return parsed.data
}

/**
 * Walk `registryDependencies` breadth-first.
 *
 * `visited` is what makes a cycle in the graph terminate instead of hanging,
 * and it also collapses the diamond case (two components both needing `utils`)
 * into a single fetch.
 *
 * Returns dependencies before dependents, so writing in order never leaves a
 * component on disk whose imports are not yet satisfied.
 */
export async function resolveItems(
  registry: string,
  names: string[],
  cwd: string,
): Promise<RegistryItem[]> {
  const visited = new Set<string>()
  const resolved: RegistryItem[] = []

  async function visit(name: string) {
    if (visited.has(name)) return
    visited.add(name)

    const item = await fetchItem(registry, name, cwd)
    for (const dependency of item.registryDependencies) {
      await visit(dependency)
    }
    resolved.push(item)
  }

  for (const name of names) {
    await visit(name)
  }

  return resolved
}
