import * as prompts from '@clack/prompts'
import pc from 'picocolors'

import { readConfig } from '../config.js'
import { CliError, logger } from '../logger.js'
import { detectPackageManager, installDependencies } from '../package-manager.js'
import { fetchIndex, resolveItems } from '../registry.js'
import { planFiles, writeFiles } from '../write-files.js'

export type AddOptions = {
  cwd: string
  overwrite: boolean
  all: boolean
  yes: boolean
  install: boolean
  registry?: string
}

export async function add(components: string[], options: AddOptions) {
  const config = await readConfig(options.cwd)
  const registry = options.registry ?? config.registry
  const index = await fetchIndex(registry, options.cwd)

  const installable = index.items.filter((item) => item.type !== 'registry:theme')

  if (options.all) {
    components = installable.map((item) => item.name)
  }

  if (components.length === 0) {
    logger.info(`\n${pc.bold('Available components')}\n`)
    for (const item of installable) {
      logger.info(`  ${pc.cyan(item.name.padEnd(14))}${pc.dim(item.description)}`)
    }
    logger.info(`\nAdd one with ${pc.bold('kairo-ui add <name>')}\n`)
    return
  }

  const known = new Set(index.items.map((item) => item.name))
  const unknown = components.filter((name) => !known.has(name))
  if (unknown.length > 0) {
    throw new CliError(
      `Unknown component${unknown.length > 1 ? 's' : ''}: ${unknown.join(', ')}`,
      'Run `kairo-ui list` to see what the registry offers.',
    )
  }

  const items = await resolveItems(registry, components, options.cwd)
  const requested = new Set(components)
  const pulledIn = items.filter((item) => !requested.has(item.name))

  const planned = await planFiles(items, config, options.cwd)
  const conflicts = planned.filter((file) => file.exists)

  logger.break()
  logger.step(
    `Resolved ${items.length} item${items.length > 1 ? 's' : ''}` +
      (pulledIn.length > 0 ? ` (${pulledIn.map((item) => item.name).join(', ')} pulled in)` : ''),
  )

  for (const file of planned) {
    const marker = file.exists && !options.overwrite ? pc.yellow('~') : pc.green('+')
    const suffix = file.exists && !options.overwrite ? pc.dim(' (exists, skipped)') : ''
    logger.info(`  ${marker} ${file.relativePath}${suffix}`)
  }

  if (conflicts.length > 0 && !options.overwrite) {
    logger.break()
    logger.warn(
      conflicts.length === 1
        ? '1 file already exists. Re-run with --overwrite to replace it.'
        : `${conflicts.length} files already exist. Re-run with --overwrite to replace them.`,
    )
  }

  const toWrite = options.overwrite ? planned : planned.filter((file) => !file.exists)
  const dependencies = [...new Set(items.flatMap((item) => item.dependencies))]

  if (toWrite.length === 0 && dependencies.length === 0) {
    logger.break()
    logger.info('Nothing to do.')
    return
  }

  if (!options.yes) {
    logger.break()
    const confirmed = await prompts.confirm({
      message: `Write ${toWrite.length} file${toWrite.length === 1 ? '' : 's'}?`,
    })
    if (prompts.isCancel(confirmed) || !confirmed) {
      logger.info('Cancelled.')
      return
    }
  }

  await writeFiles(toWrite)
  logger.break()
  logger.success(`Wrote ${toWrite.length} file${toWrite.length === 1 ? '' : 's'}`)

  if (options.install && dependencies.length > 0) {
    const manager = await detectPackageManager(options.cwd)
    logger.step(`Installing ${dependencies.join(', ')} with ${manager}`)
    await installDependencies(manager, dependencies, options.cwd)
    logger.success('Dependencies installed')
  } else if (dependencies.length > 0) {
    logger.warn(`Install these yourself: ${dependencies.join(' ')}`)
  }

  logger.break()
}
