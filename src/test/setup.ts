import '@testing-library/jest-dom/vitest'

import { vi } from 'vitest'

// jsdom implements none of these. They are not what any test is asserting on,
// but the theme provider, the TOC scrollspy and Radix all reach for them during
// render — so stubbing them here keeps the failure surface on real behaviour.

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

vi.stubGlobal('IntersectionObserver', NoopObserver)
vi.stubGlobal('ResizeObserver', NoopObserver)

// GitHubStars fires a request on mount. A test must never depend on
// api.github.com being reachable, so reject and let the component's own catch
// render nothing.
vi.stubGlobal(
  'fetch',
  vi.fn(() => Promise.reject(new Error('network disabled in tests'))),
)
