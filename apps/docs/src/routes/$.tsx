import { createFileRoute, notFound } from '@tanstack/react-router';
import { NotFound } from '@/components/not-found';

/**
 * Root-level splat, matched whenever no other route claims the URL (e.g.
 * `/nonsense`, or `/th/nonsense` — Thai locale detection lives in
 * `NotFound` itself, not in a params, so there is no `th.$.tsx` twin).
 *
 * Without this route, a totally unmatched pathname resolves to only the
 * `__root__` match. On the static Cloudflare deploy, Cloudflare's
 * `not_found_handling: "404-page"` serves the prerendered `404.html` bytes
 * (dehydrated for `/404`, one match below root) at the *original* URL. The
 * client then re-matches against that real URL, gets just the root match,
 * and `@tanstack/router-core`'s hydration code (`ssr-client.js`, in the
 * `isSpaMode` branch) reads `matches[1]` expecting a match below root that
 * doesn't exist — an `invariant()` throw that permanently blanks the page
 * (it throws twice, since `StartClient` memoizes the hydration promise and
 * `React.use()` re-throws the settled rejection on React's retry render).
 * This route guarantees that below-root match always exists.
 *
 * `loader: () => throw notFound()` keeps this route's prerender response at
 * HTTP 404 — which is exactly what makes `pnpm build` fail loudly on a
 * broken internal `<a href>` (a prerendered 200 would hide the mistake
 * instead). With the loader always throwing, `MatchInner` falls through to
 * `renderRouteNotFound` (which — since this route has no `notFoundComponent`
 * of its own — renders the router's `defaultNotFoundComponent`, `NotFound`,
 * wired up in `src/router.tsx`), so `component` below never actually
 * renders. Do not "simplify" this back to no loader / a real `notFound()`
 * check inside `component` — that would return 200 and silently delete the
 * existing build guard.
 *
 * `component: NotFound` is set anyway, purely so this route has the same
 * option *shape* as `routes/404.tsx` (see the `splitBehavior` comment in
 * `vite.config.ts` for why that shape has to match): a route-splitting
 * concern, not a rendering one. It never executes.
 *
 * `pendingComponent: NotFound` + `pendingMinMs: 0` cover the hydration
 * paint itself (see `ssr-client.js`'s `setMatchForcePending`, invoked for
 * `matches[1]` while in SPA mode): the first client render of this match
 * shows `NotFound` immediately, matching the served `404.html` bytes with
 * no hydration-mismatch flash, and `pendingMinMs: 0` disables the router's
 * default 500ms forced-minimum pending display (there's nothing to wait
 * out — the loader's `notFound()` rejects synchronously).
 */
export const Route = createFileRoute('/$')({
  loader: () => {
    throw notFound();
  },
  component: NotFound,
  pendingComponent: NotFound,
  pendingMinMs: 0,
});
