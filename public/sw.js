const CACHE_NAME = 'smartcalc-hub-v1';
const STATIC_ASSETS = [
  '/Smart-Calc-HUB/',
  '/Smart-Calc-HUB/index.html',
  '/Smart-Calc-HUB/manifest.json',
  '/Smart-Calc-HUB/favicon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching static shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // For HTML navigation requests, use Network-First, fallback to cached index.html
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clonedResponse));
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match('/Smart-Calc-HUB/index.html') || caches.match('/Smart-Calc-HUB/');
          });
        })
    );
    return;
  }

  // For static assets (JS, CSS, Images, Fonts), use Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        }
        return networkResponse;
      }).catch(() => {
        // Network failed, silently rely on cache
      });
      return cachedResponse || fetchPromise;
    })
  );
});

// Placeholder structure for Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'SmartCalc Hub', body: 'New calculation tools available offline!' };
  const options = {
    body: data.body,
    icon: '/Smart-Calc-HUB/favicon.svg',
    badge: '/Smart-Calc-HUB/favicon.svg',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/Smart-Calc-HUB/' }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow(event.notification.data.url)
  );
});

// Placeholder structure for Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-calculations') {
    console.log('[ServiceWorker] Background sync triggered for calculation history');
  }
});
