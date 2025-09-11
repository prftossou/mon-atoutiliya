const CACHE_NAME = 'atoutiliya-cache-v2';
const urlsToCache = [
  '/',
  '/?utm_source=pwa',
  '/search/label/MONTRE',  // Exemple pour catégorie produits
  '/p/chariot.html',  // Si vous avez une page panier
  '/p/contact.html',
  'https://www.atoutiliya.com/'  // Fallback
];

// Installation : Précache les URLs
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activation : Nettoie les anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch : Stratégie cache-first pour vitesse, fallback network
self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request)
          .then(fetchResponse => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          })
        )
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});

