import { spawn } from 'node:child_process'
import { access } from 'node:fs/promises'
import path from 'node:path'

import { CliError } from './logger.js'

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

const LOCKFILES: [string, PackageManager][] = [
  ['pnpm-lock.yaml', 'pnpm'],
  ['bun.lockb', 'bun'],
  ['bun.lock', 'bun'],
  ['yarn.lock', 'yarn'],
  ['package-lock.json', 'npm'],
]

/**
 * Detect from the lockfile rather than from `npm_config_user_agent`: under
 * `npx`, the agent always reports npm even in a pnpm project, and installing
 * with the wrong manager writes a second lockfile.
 */
export async function detectPackageManager(cwd: string): Promise<PackageManager> {
  for (const [lockfile, manager] of LOCKFILES) {
    try {
      await access(path.join(cwd, lockfile))
      return manager
    } catch {
      continue
    }
  }
  return 'npm'
}

export async function installDependencies(
  manager: PackageManager,
  packages: string[],
  cwd: string,
): Promise<void> {
  if (packages.length === 0) return

  const args = manager === 'npm' ? ['install', ...packages] : ['add', ...packages]

  await new Promise<void>((resolve, reject) => {
    const child = spawn(manager, args, {
      cwd,
      stdio: ['ignore', 'ignore', 'inherit'],
      // package managers are .cmd shims on Windows, which execvp cannot run
      // directly.
      shell: process.platform === 'win32',
    })

    child.on('error', (error) => reject(new CliError(`Could not run ${manager}`, error.message)))
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new CliError(`${manager} exited with code ${code}`))
    })
  })
}
