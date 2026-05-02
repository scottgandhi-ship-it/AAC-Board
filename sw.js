const CACHE_NAME = 'aac-board-v62';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './js/state.js',
  './js/vocabulary.js',
  './js/ui-shared.js',
  './js/storage.js',
  './js/i18n.js',
  './js/grammar.js',
  './js/tts.js',
  './css/tokens.css',
  './css/ui-shared.css',
  './css/app-chrome.css',
  './css/message-bar.css',
  './css/grid.css',
  './css/modals.css',
  './css/onboarding.css',
  './css/settings.css',
  './css/activities.css',
  './css/insights.css',
  './css/responsive.css',
  './assets/fonts/Inter.woff2'
];

// Install — pre-cache shell assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network-first strategy
self.addEventListener('fetch', e => {
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
