const CACHE_NAME = 'guiding-steps-v17';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './fonts/Fraunces-Regular.woff2',
  './fonts/Inter-Medium.woff2',
  './fonts/Inter-SemiBold.woff2'
];

// Install -- pre-cache shell assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate -- delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch -- network-first for HTML/app assets, cache-first for immutable fonts
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.includes('/fonts/') && url.pathname.endsWith('.woff2')) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      }))
    );
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
