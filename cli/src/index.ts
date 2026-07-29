#!/usr/bin/env node
import path from 'node:path'
import process from 'node:process'

import { Command } from 'commander'
import pc from 'picocolors'

import { add } from './commands/add.js'
import { init } from './commands/init.js'
import { list } from './commands/list.js'
import { CliError, logger } from './logger.js'

const DEFAULT_REGISTRY = 'https://kairo-ui.dev/r'
const VERSION = '0.1.0'

function resolveCwd(value: string) {
  return path.resolve(process.cwd(), value)
}

const program = new Command()
  .name('kairo-ui')
  .description('Add kairo-ui components to your project.')
  .version(VERSION)

program
  .command('init')
  .description('Set up kairo.json, design tokens and base dependencies')
  .option('--css <path>', 'stylesheet to merge design tokens into')
  .option('--cwd <path>', 'directory to run in', process.cwd())
  .option('--registry <url>', 'registry to read from', DEFAULT_REGISTRY)
  .option('-y, --yes', 'accept every default', false)
  .option('--no-install', 'skip the package manager')
  .action(async (options) => {
    await init({
      cwd: resolveCwd(options.cwd),
      css: options.css,
      yes: options.yes,
      install: options.install,
      registry: options.registry,
    })
  })

program
  .command('add')
  .description('Add components to your project')
  .argument('[components...]', 'component names; omit to list what is available')
  .option('-a, --all', 'add every component', false)
  .option('-o, --overwrite', 'replace files that already exist', false)
  .option('--registry <url>', 'override the registry for this run')
  .option('--cwd <path>', 'directory to run in', process.cwd())
  .option('-y, --yes', 'skip the confirmation prompt', false)
  .option('--no-install', 'skip the package manager')
  .action(async (components: string[], options) => {
    await add(components, {
      cwd: resolveCwd(options.cwd),
      overwrite: options.overwrite,
      all: options.all,
      yes: options.yes,
      install: options.install,
      registry: options.registry,
    })
  })

program
  .command('list')
  .description('Print the registry contents')
  .option('--registry <url>', 'registry to read from')
  .option('--cwd <path>', 'directory to run in', process.cwd())
  .option('--json', 'emit JSON', false)
  .action(async (options) => {
    await list({
      cwd: resolveCwd(options.cwd),
      registry: options.registry,
      json: options.json,
    })
  })

try {
  await program.parseAsync()
} catch (error) {
  // Expected failures print a message and a hint. Anything else is a bug here,
  // and the stack trace is the useful part.
  if (error instanceof CliError) {
    logger.break()
    logger.error(error.message)
    if (error.hint) logger.info(pc.dim(`  ${error.hint}`))
    logger.break()
    process.exit(1)
  }
  throw error
}
