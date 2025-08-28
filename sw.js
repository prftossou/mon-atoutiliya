self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("atoutiliya-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/?utm_source=pwa",
        "https://www.atoutiliya.com/"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});