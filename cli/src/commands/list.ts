import process from 'node:process'

import pc from 'picocolors'

import { readConfig } from '../config.js'
import { fetchIndex } from '../registry.js'

export type ListOptions = {
  cwd: string
  registry?: string
  json: boolean
}

export async function list(options: ListOptions) {
  // A registry can be listed without a configured project, so fall back to the
  // published default rather than demanding kairo.json.
  const registry =
    options.registry ??
    (await readConfig(options.cwd)
      .then((config) => config.registry)
      .catch(() => 'https://kairo-ui.dev/r'))

  const index = await fetchIndex(registry, options.cwd)

  // The only command whose payload goes to stdout — it is data, not progress.
  if (options.json) {
    process.stdout.write(`${JSON.stringify(index.items, null, 2)}\n`)
    return
  }

  const width = Math.max(...index.items.map((item) => item.name.length)) + 2

  process.stdout.write(`\n${pc.bold(index.name)} ${pc.dim(registry)}\n\n`)
  for (const item of index.items) {
    process.stdout.write(`  ${pc.cyan(item.name.padEnd(width))}${pc.dim(item.description)}\n`)
  }
  process.stdout.write('\n')
}
