// Service Worker for Netify CR - Version 1.0
const CACHE_NAME = 'netify-cr-v1';
const OFFLINE_URL = '/offline.html';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/non-critical.css',
  '/js/main.js',
  '/images/logo.png',
  '/images/hero-bg.webp',
  '/images/hero-bg.jpg',
  OFFLINE_URL
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_URLS);
      })
  );
  // Activate the service worker immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients
  event.waitUntil(clients.claim());
});

// Fetch event - network first, then cache
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If we got a valid response, cache it
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(event.request)
            .then(response => {
              // Return cached response or offline page
              return response || caches.match(OFFLINE_URL);
            });
        })
    );
  } else {
    // For non-navigation requests, try cache first
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached response if found
          if (response) {
            return response;
          }
          // Otherwise fetch from network
          return fetch(event.request)
            .then(response => {
              // Cache the response if it's good
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
              return response;
            });
        })
    );
  }
});

// Push notification event listener
self.addEventListener('push', event => {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  const data = event.data?.json();
  const title = data?.title || 'Nueva notificación';
  const options = {
    body: data?.body || 'Tienes una nueva notificación de Netify CR',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge.png',
    data: {
      url: data?.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        const url = event.notification.data.url || '/';
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Background sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-form-data') {
    event.waitUntil(syncFormData());
  }
});

async function syncFormData() {
  // Implement background sync for form data
  const cache = await caches.open('form-data');
  const requests = await cache.keys();
  
  for (const request of requests) {
    const response = await cache.match(request);
    if (response) {
      try {
        const formData = await response.json();
        // Send data to server
        const fetchResponse = await fetch('/api/submit-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (fetchResponse.ok) {
          // Remove from cache if successfully sent
          await cache.delete(request);
        }
      } catch (error) {
        console.error('Error syncing form data:', error);
      }
    }
  }
}
