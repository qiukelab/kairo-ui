import { StarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { siteConfig } from '@/lib/site'

const CACHE_KEY = 'kairo-ui-github-stars'
const CACHE_TTL = 60 * 60 * 1000

type Cached = { count: number; fetchedAt: number }

function readCache(): number | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw) as Cached
    if (Date.now() - cached.fetchedAt > CACHE_TTL) return null
    return cached.count
  } catch {
    return null
  }
}

/**
 * The unauthenticated GitHub API allows 60 requests an hour per IP, so the
 * result is cached for an hour and every failure is swallowed — the header must
 * not depend on a third-party call succeeding.
 */
export function GitHubStars() {
  const [stars, setStars] = useState<number | null>(readCache)

  useEffect(() => {
    if (stars !== null) return

    const controller = new AbortController()
    const { owner, repo } = siteConfig.github

    fetch(`https://api.github.com/repos/${owner}/${repo}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data: { stargazers_count?: number }) => {
        if (typeof data.stargazers_count !== 'number') return
        setStars(data.stargazers_count)
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              count: data.stargazers_count,
              fetchedAt: Date.now(),
            } satisfies Cached),
          )
        } catch {
          // Storage unavailable — we just refetch next mount.
        }
      })
      .catch(() => {
        // Rate limited, offline, or the repo is private. Render nothing.
      })

    return () => controller.abort()
  }, [stars])

  if (stars === null) return null

  return (
    <span className="hidden items-center gap-1 text-xs text-muted-foreground tabular-nums sm:inline-flex">
      <StarIcon className="size-3" aria-hidden />
      {Intl.NumberFormat('en', { notation: 'compact' }).format(stars)}
      <span className="sr-only">GitHub stars</span>
    </span>
  )
}
