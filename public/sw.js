self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('static-cache').then((cache) => {
        return cache.addAll(['/offline.html']);
      })
    );
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== 'static-cache') {
              return caches.delete(cache);
            }
          })
        );
      })
    );
    self.clients.claim();
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  });