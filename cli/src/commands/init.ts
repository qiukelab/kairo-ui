import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import * as prompts from '@clack/prompts'
import pc from 'picocolors'

import { CONFIG_FILE, configSchema, type Config } from '../config.js'
import { CliError, logger } from '../logger.js'
import { detectPackageManager, installDependencies } from '../package-manager.js'
import { fetchItem } from '../registry.js'
import { planFiles, writeFiles } from '../write-files.js'

const TOKENS_START =
  '/* kairo-ui:tokens:start — managed by `kairo-ui init`, edits below are kept */'
const TOKENS_END = '/* kairo-ui:tokens:end */'

const CSS_CANDIDATES = [
  'src/styles/globals.css',
  'src/app/globals.css',
  'app/globals.css',
  'src/index.css',
  'styles/globals.css',
]

export type InitOptions = {
  cwd: string
  css?: string
  yes: boolean
  install: boolean
  registry: string
}

export async function init(options: InitOptions) {
  const existing = await fileExists(path.join(options.cwd, CONFIG_FILE))
  if (existing && !options.yes) {
    const overwrite = await prompts.confirm({
      message: `${CONFIG_FILE} already exists. Rewrite it?`,
      initialValue: false,
    })
    if (prompts.isCancel(overwrite) || !overwrite) {
      logger.info('Keeping the existing config; only tokens will be refreshed.')
    }
  }

  const css = options.css ?? (await detectCss(options.cwd, options.yes))

  const config: Config = configSchema.parse({
    $schema: 'https://kairo-ui.dev/schema.json',
    style: 'default',
    tsx: true,
    tailwind: { css },
    aliases: {
      components: '@/components',
      ui: '@/components/ui',
      lib: '@/lib',
      utils: '@/lib/utils',
      hooks: '@/hooks',
    },
    iconLibrary: 'lucide',
    registry: options.registry,
  })

  logger.break()

  await writeFile(
    path.join(options.cwd, CONFIG_FILE),
    `${JSON.stringify(config, null, 2)}\n`,
    'utf8',
  )
  logger.success(`Wrote ${CONFIG_FILE}`)

  // Tokens and the cn helper are the floor every component stands on, so init
  // installs both rather than leaving the first `add` to discover them missing.
  const theme = await fetchItem(options.registry, 'theme', options.cwd)
  const tokens = theme.files.find((file) => file.type === 'registry:theme')
  if (!tokens) {
    throw new CliError('The registry theme item has no token file')
  }

  await mergeTokens(path.join(options.cwd, css), tokens.content)
  logger.success(`Merged design tokens into ${css}`)

  const utils = await fetchItem(options.registry, 'utils', options.cwd)
  const planned = await planFiles([utils], config, options.cwd)
  const toWrite = planned.filter((file) => !file.exists)
  await writeFiles(toWrite)
  for (const file of toWrite) {
    logger.success(`Wrote ${file.relativePath}`)
  }

  const dependencies = [
    'clsx',
    'tailwind-merge',
    'class-variance-authority',
    'lucide-react',
    'radix-ui',
  ]

  if (options.install) {
    const manager = await detectPackageManager(options.cwd)
    logger.step(`Installing base dependencies with ${manager}`)
    await installDependencies(manager, dependencies, options.cwd)
    logger.success('Dependencies installed')
  } else {
    logger.warn(`Install these yourself: ${dependencies.join(' ')}`)
  }

  logger.break()
  logger.info(`Next: ${pc.bold('kairo-ui add button')}`)
  logger.break()
}

async function detectCss(cwd: string, yes: boolean): Promise<string> {
  for (const candidate of CSS_CANDIDATES) {
    if (await fileExists(path.join(cwd, candidate))) return candidate
  }

  if (yes) return CSS_CANDIDATES[0]

  const answer = await prompts.text({
    message: 'Where is your Tailwind stylesheet?',
    placeholder: CSS_CANDIDATES[0],
    defaultValue: CSS_CANDIDATES[0],
  })

  return prompts.isCancel(answer) || !answer ? CSS_CANDIDATES[0] : answer
}

/**
 * Replace the block between the markers, or append one if it is absent.
 *
 * The markers are what make `init` idempotent: a second run refreshes the
 * tokens without touching anything the project added around them.
 */
async function mergeTokens(file: string, tokens: string) {
  const block = `${TOKENS_START}\n${tokens.trim()}\n${TOKENS_END}\n`

  let current: string
  try {
    current = await readFile(file, 'utf8')
  } catch {
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, `@import 'tailwindcss';\n\n${block}`, 'utf8')
    return
  }

  const start = current.indexOf(TOKENS_START)
  const end = current.indexOf(TOKENS_END)

  if (start !== -1 && end !== -1 && end > start) {
    const next = current.slice(0, start) + block + current.slice(end + TOKENS_END.length + 1)
    await writeFile(file, next, 'utf8')
    return
  }

  await writeFile(file, `${current.trimEnd()}\n\n${block}`, 'utf8')
}

async function fileExists(file: string) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}
