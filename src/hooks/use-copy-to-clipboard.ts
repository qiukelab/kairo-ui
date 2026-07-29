import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Copy text and flip to a "copied" state for `resetAfter` ms.
 *
 * The timer is stored in a ref and cleared on unmount so a copy immediately
 * before navigating away can't call setState on an unmounted component.
 */
export function useCopyToClipboard(resetAfter = 2000) {
  const [copied, setCopied] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timeout.current), [])

  const copy = useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value)
      } catch {
        // Clipboard is unavailable over plain HTTP or without permission.
        // Nothing useful to show the user, so leave the button untouched.
        return
      }
      setCopied(true)
      clearTimeout(timeout.current)
      timeout.current = setTimeout(() => setCopied(false), resetAfter)
    },
    [resetAfter],
  )

  return { copied, copy }
}
