import { createFileRoute } from '@tanstack/react-router';
import { NotFound } from '@/components/not-found';

/**
 * A real, directly-navigable `/404` page — not just the router's client-side
 * `notFoundComponent` fallback — so it can be prerendered to `404.html` (see
 * the matching `pages` entry in `vite.config.ts`) and served by Cloudflare's
 * `not_found_handling: "404-page"` for any unmatched path on this static site.
 *
 * `pendingComponent: NotFound` alongside `component: NotFound` looks
 * redundant on a route whose loader never even suspends, but it isn't: it's
 * what makes this route emit the same Suspense-boundary shape into the
 * prerendered `404.html` as the routes that actually rely on hydrating
 * through a pending state (see `routes/$.tsx` and `routes/docs.$.tsx`,
 * where a `pendingComponent` is load-bearing for exactly this reason). The
 * whole point of prerendering `/404` is to hand Cloudflare bytes a client
 * can hydrate onto cleanly for *any* mismatched route below root, so this
 * page's own Suspense shape has to be built the same way theirs is.
 */
export const Route = createFileRoute('/404')({
  component: NotFound,
  pendingComponent: NotFound,
});
