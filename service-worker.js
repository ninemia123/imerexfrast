// ΑΥΤΟΜΑΤΗ ΕΚΔΟΣΗ - Διάβασε την έκδοση από το HTML
const CACHE_NAME = "imerast-v" + new URL(location.href).searchParams.get('v') || "7.4";
const assets = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting(); // Force activate νέο SW
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  // Διέγραψε παλιές caches
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Ανέλαβε έλεγχο όλων των tabs
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Network first για HTML, cache first για assets
      if (event.request.mode === 'navigate') {
        return fetch(event.request).catch(() => response);
      }
      return response || fetch(event.request);
    })
  );
});
