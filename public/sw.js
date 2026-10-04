const CACHE_PREFIX = 'quadro-anuncios-';
const STATIC_CACHE = `${CACHE_PREFIX}static-v2`;

const staticAssets = [
  '/offline.html',
  '/manifest.json',
  '/icons/anuncios-icon-192x192.png',
  '/icons/anuncios-icon-512x512.png',
];

// Install event - pre-cache recursos estaticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Cache estatico aberto');
        return cache.addAll(staticAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames
        .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && cacheName !== STATIC_CACHE)
        .map((cacheName) => caches.delete(cacheName))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin || request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => (await caches.match('/offline.html')) || Response.error())
    );
    return;
  }

  if (!['script', 'style', 'image', 'font'].includes(request.destination)) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, responseClone));
        }
        return response;
      });
    })
  );
});

// Push Notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push recebido:', event);
  
  let data = {
    title: 'Quadro de Anúncios',
    body: 'Você tem uma nova notificação',
    icon: '/icons/anuncios-icon-192x192.png',
    badge: '/icons/anuncios-icon-192x192.png',
    tag: 'infoflow-notification',
    data: { url: '/consulta' }
  };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon || '/icons/anuncios-icon-192x192.png',
    badge: data.badge || '/icons/anuncios-icon-192x192.png',
    tag: data.tag || 'infoflow-notification',
    renotify: true,
    vibrate: [200, 100, 200],
    data: data.data || { url: '/consulta' },
    actions: data.actions || [
      { action: 'open', title: 'Abrir' },
      { action: 'close', title: 'Fechar' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Click na notificacao
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notificacao clicada:', event);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/consulta';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Se ja existe uma janela aberta, focar nela
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // Caso contrario, abrir nova janela
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();

  if (event.data?.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX))
          .map((cacheName) => caches.delete(cacheName))
      ))
    );
  }
});
