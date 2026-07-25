// Service Worker for Dunkerque Pêche IA
const CACHE_NAME = "dk-fishing-v17";
const ASSETS_TO_CACHE = [
  "index.html",
  "style.css",
  "app.js",
  "fish_database.js",
  "spots_database.js",
  "icon-192.png",
  "icon-512.png",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "https://unpkg.com/lucide@latest",
  "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
];

// Install Event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell and libraries");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - network-first for local code, cache-first for libraries
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Cache-first for external CDNs (Leaflet, Lucide, Google Fonts)
  if (url.origin === "https://unpkg.com" || url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com") {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else {
    // Network-first for our own files (so edits apply immediately if online)
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // If valid response, cache it
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(event.request);
        })
    );
  }
});
