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

// Same category, on Element rather than window. cmdk calls scrollIntoView to
// keep the highlighted item in view, and Radix Select calls the pointer-capture
// methods while tracking a press. jsdom implements none of the four, so without
// these the components throw during render and every assertion in the file is
// lost to a crash that has nothing to do with what it was testing.
Element.prototype.scrollIntoView ??= () => {}
Element.prototype.hasPointerCapture ??= () => false
Element.prototype.setPointerCapture ??= () => {}
Element.prototype.releasePointerCapture ??= () => {}

// GitHubStars fires a request on mount. A test must never depend on
// api.github.com being reachable, so reject and let the component's own catch
// render nothing.
vi.stubGlobal(
  'fetch',
  vi.fn(() => Promise.reject(new Error('network disabled in tests'))),
)
