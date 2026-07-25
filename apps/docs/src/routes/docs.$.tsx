import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { NotFound } from '@/components/not-found';
import { fetchDocsData } from '@/lib/docs-data-client';
import { docsClientLoader, DocsPageBody } from '@/lib/docs-page';
import { source } from '@/lib/source';

// Deployed origin (see `apps/docs/wrangler.jsonc`'s Worker name and the
// matching constant in `routes/__root.tsx`) — the canonical link below must
// be absolute.
const SITE_URL = 'https://kairo-docs.quantumdevq.workers.dev';

// Kept as a direct, top-level `createServerFn(...).handler(...)` call (not
// factored into a shared helper) — see the note in `src/lib/docs-page.tsx`.
// This runs at prerender time; `source` (and the eager `collections/server`
// it pulls in) is stripped from the client bundle by TanStack's server-fn
// extraction. On the client we must NOT call it — a server function 404s
// against this static, Worker-less deploy — so the loader below fetches the
// prebuilt `docs-data-en.json` there instead.
const serverLoader = createServerFn({ method: 'GET' })
  .validator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs, 'en');
    if (!page) throw notFound();

    return {
      path: page.path,
      title: page.data.title,
      description: page.data.description,
      pageTree: await source.serializePageTree(source.getPageTree('en')),
    };
  });

// Client half of the loader: resolve the same `{ path, title, description,
// pageTree }` shape from the static JSON. `import.meta.env.SSR` is statically
// replaced per build, so this whole branch is dead-code-eliminated from the
// server bundle and the `serverLoader` branch from the client bundle.
async function clientLoader(slugs: string[]) {
  const data = await fetchDocsData('en');
  const meta = data.pages[slugs.join('/')];
  if (!meta) throw notFound();
  return { ...meta, pageTree: data.tree };
}

export const Route = createFileRoute('/docs/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? [];
    const data = import.meta.env.SSR
      ? await serverLoader({ data: slugs })
      : await clientLoader(slugs);
    await docsClientLoader.preload(data.path);
    return data;
  },
  // A bad slug under `/docs/` (e.g. `/docs/no-such-page`) still matches this
  // route — unlike a totally unmatched path, there's no `invariant()` throw
  // here (see `routes/$.tsx`) — but the client's dehydrated-match lookup in
  // `ssr-client.js`'s `hydrate()` finds no counterpart for it and sets
  // `match.ssr = false`. That flips `resolvedNoSsr` to `true` in `Match.js`,
  // which forces this match through a `<ClientOnly fallback={pendingElement}>`
  // Suspense boundary. With no `pendingComponent` configured, `pendingElement`
  // is `null`, so the very first client render paints nothing where the
  // server painted the full `NotFound` tree — a hydration mismatch that makes
  // React discard the SSR DOM and blank-flash before recovering.
  // `pendingComponent: NotFound` makes that first client paint match the
  // prerendered bytes exactly, so there's nothing to mismatch.
  pendingComponent: NotFound,
  // Mandatory, and not optional polish: setting a `pendingComponent` above
  // arms `load-matches.js`'s `setupPendingTimeout`, which — left at its
  // default — would flash the 404 page during a slow but legitimate
  // client-side navigation into a real docs page while its loader is still
  // in flight. `pendingMs: Infinity` disarms that timer specifically
  // (`load-matches.js` skips arming it when `pendingMs === Infinity`)
  // without touching the hydration-time pending display, which is driven
  // separately through `hasForcePendingActiveMatch` and unaffected by this
  // option. Net effect on navigation is unchanged from before this fix: today
  // there is no `pendingComponent` at all, so this timer was never armed
  // either.
  pendingMs: Infinity,
  // `match.pathname` is this route's own resolved pathname — since `/docs/$`
  // is a leaf route, that's the exact current URL, used as-is for the
  // canonical link below (no need to reconstruct it from `params._splat`).
  head: ({ loaderData, match }) =>
    loaderData
      ? {
          meta: [
            { title: loaderData.title },
            ...(loaderData.description
              ? [{ name: 'description', content: loaderData.description }]
              : []),
            { property: 'og:title', content: loaderData.title },
            ...(loaderData.description
              ? [{ property: 'og:description', content: loaderData.description }]
              : []),
          ],
          links: [{ rel: 'canonical', href: `${SITE_URL}${match.pathname}` }],
        }
      : {},
});

function Page() {
  const { path, pageTree } = useFumadocsLoader(Route.useLoaderData());
  return <DocsPageBody path={path} pageTree={pageTree} locale="en" />;
}
