// Minimal service worker: makes the app installable and shows an offline page when the network is down.
// API calls and course videos are never cached, so learners always see live data and progress.
const CACHE = "gloxad-shell-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([OFFLINE_URL, "/icons/icon-192.png"])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.mode !== "navigate") return;
  event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
});
