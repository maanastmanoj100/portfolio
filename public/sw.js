/**
 * Cyber Nexus service worker.
 *
 * Strategy (deliberately conservative — it must never serve a stale app shell):
 *  - Navigations: network-first. The cached copy is never used while online, so a
 *    new deployment is picked up immediately instead of referencing old chunks.
 *  - Offline: fall back to the cached /offline page.
 *  - Immutable build output (/_next/static) and media: stale-while-revalidate.
 *  - Everything else (API calls, RSC payloads, cross-origin) is untouched.
 */
const VERSION = "cnx-v3";
const STATIC_CACHE = `${VERSION}-static`;
const OFFLINE_URL = "/offline";
const PRECACHE = [OFFLINE_URL, "/manifest.json"];
const STATIC_ASSET = /\.(?:css|js|mjs|woff2?|ttf|otf|png|jpe?g|gif|svg|webp|avif|ico)$/i;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await Promise.all(
        PRECACHE.map((url) => cache.add(url).catch(() => undefined)),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Never touch cross-origin requests or the analytics API.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // Documents: always try the network first.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request);
        } catch {
          const offline = await caches.match(OFFLINE_URL);
          return offline || Response.error();
        }
      })(),
    );
    return;
  }

  // Immutable assets: serve from cache, refresh in the background.
  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") || STATIC_ASSET.test(url.pathname);

  if (isStaticAsset) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match(request);

        const network = fetch(request)
          .then((response) => {
            if (response && response.ok && response.type === "basic") {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cached);

        return cached || network;
      })(),
    );
  }
});
