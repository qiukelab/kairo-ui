/**
 * Human-readable byte count.
 *
 * Lives here rather than in `attachment.tsx` because a module that exports both
 * components and plain functions breaks React Fast Refresh — the same reason
 * `Callout` has its own file.
 *
 * Binary units (1024), labelled with the SI names people actually recognise —
 * the compromise `ls -h` and every file manager makes.
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return ''
  if (bytes < 1024) return `${bytes} B`

  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  // One decimal below 10 (1.1 MB), none above it (820 KB) — the extra digit
  // stops mattering as the number grows.
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`
}
