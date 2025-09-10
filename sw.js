self.addEventListener("install", (event) => {
  console.log("Service Worker en cours d'installation...");
  event.waitUntil(
    caches.open("atoutiliya-cache").then((cache) => {
      return cache.addAll([
        "/", // page d’accueil
        "/?utm_source=pwa",
        "https://atoutiliya.com/" // ton site principal (⚠️ supprime le "www." pour éviter le mixed content)
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activé.");
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
