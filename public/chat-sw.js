const CACHE_NAME = 'jw-assistente-v1';
const STATIC_ASSETS = [
  '/chat',
  '/chat-manifest.json',
  '/icons/chat-icon-192x192.jpg',
  '/icons/chat-icon-512x512.jpg',
];

// Instala e pré-cacheia recursos estáticos do chat
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Ativa e remove caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições de outras origens
  if (url.origin !== location.origin) return;

  // Rotas de IA: Network Only (não cacheia streaming)
  if (
    url.pathname.startsWith('/api/chat') ||
    url.pathname.startsWith('/api/partes') ||
    url.pathname.startsWith('/api/campo')
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // Navegação para /chat: Network First com fallback para cache
  if (request.mode === 'navigate' && url.pathname.startsWith('/chat')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('/chat')))
    );
    return;
  }

  // Recursos estáticos (JS, CSS, imagens, fontes): Cache First
  if (
    request.destination === 'script' ||
    request.destination === 'style'  ||
    request.destination === 'image'  ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Demais requisições: Network First
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
