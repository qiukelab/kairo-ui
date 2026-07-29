/**
 * Turns registry.json into the static JSON the CLI fetches.
 *
 * Output goes to public/, so it is copied verbatim into dist/ and the docs site
 * and the registry are the same deployment — a component cannot be documented
 * here without also being installable from here.
 *
 * Run via `npm run registry:build`, which `npm run build` depends on.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const root = path.resolve(import.meta.dirname, '..')
const manifestPath = path.join(root, 'registry.json')
const outputDir = path.join(root, 'public', 'r')

function fail(message) {
  console.error(`registry: ${message}`)
  process.exit(1)
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const names = new Set()

for (const item of manifest.items) {
  if (names.has(item.name)) fail(`duplicate item "${item.name}"`)
  names.add(item.name)
}

// Validate the graph before writing anything: a dangling name would only
// surface as a 404 during someone else's `add`.
for (const item of manifest.items) {
  for (const dependency of item.registryDependencies ?? []) {
    if (!names.has(dependency)) {
      fail(`"${item.name}" depends on unknown item "${dependency}"`)
    }
  }
}

await rm(outputDir, { recursive: true, force: true })
await mkdir(outputDir, { recursive: true })

const index = []

for (const item of manifest.items) {
  const files = []

  for (const file of item.files) {
    const absolute = path.join(root, file.path)
    let content
    try {
      content = await readFile(absolute, 'utf8')
    } catch {
      fail(`"${item.name}" references missing file ${file.path}`)
    }
    files.push({ ...file, content })
  }

  const entry = {
    $schema: manifest.$schema,
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    files,
  }

  await writeFile(path.join(outputDir, `${item.name}.json`), JSON.stringify(entry, null, 2))

  // The index carries everything except file bodies, so `list` and the
  // resolver stay cheap.
  index.push({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: entry.dependencies,
    registryDependencies: entry.registryDependencies,
  })
}

await writeFile(
  path.join(outputDir, 'index.json'),
  JSON.stringify({ name: manifest.name, homepage: manifest.homepage, items: index }, null, 2),
)

console.log(`registry: wrote ${index.length} items to public/r`)
