import process from 'node:process'

import pc from 'picocolors'

/**
 * Everything except `list` output goes to stderr, so the CLI composes in
 * scripts: `kairo-ui list > components.txt` captures data, not decoration.
 */
export const logger = {
  info(message: string) {
    process.stderr.write(`${message}\n`)
  },
  step(message: string) {
    process.stderr.write(`${pc.blue('›')} ${message}\n`)
  },
  success(message: string) {
    process.stderr.write(`${pc.green('✓')} ${message}\n`)
  },
  warn(message: string) {
    process.stderr.write(`${pc.yellow('!')} ${message}\n`)
  },
  error(message: string) {
    process.stderr.write(`${pc.red('✗')} ${message}\n`)
  },
  break() {
    process.stderr.write('\n')
  },
}

/**
 * An expected failure — a missing config, an unknown component. Thrown to the
 * top level, printed without a stack trace, and exits 1.
 */
export class CliError extends Error {
  readonly hint?: string

  constructor(message: string, hint?: string) {
    super(message)
    this.name = 'CliError'
    this.hint = hint
  }
}
