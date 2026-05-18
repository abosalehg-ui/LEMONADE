// Lemonade Tycoon service worker — offline-first caching.
// Bump CACHE_NAME on every release so old caches are purged.

const CACHE_NAME = 'lemonade-v2';

const PRECACHE_URLS = [
    './',
    'index.html',
    'styles.css',
    'translations.js',
    'state.js',
    'sounds.js',
    'ui.js',
    'main.js',
    'game.js',
    'manifest.webmanifest',
    'icon.svg',
    'assets/LEMONADE.jpg',
    'background-music.mp3',
    'button-click.mp3',
    'cash-register.mp3',
    'upgrade-sound.mp3',
    'achievement.mp3',
    'happy-customer.mp3',
    'angry-customer.mp3'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            // addAll fails the install if ANY resource is missing; allSettled is more forgiving.
            Promise.allSettled(PRECACHE_URLS.map(url => cache.add(url)))
        ).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                // Opportunistically cache successful same-origin or basic responses
                // (skip opaque/cross-origin to avoid filling cache with junk).
                if (response && response.ok && (response.type === 'basic' || response.type === 'cors')) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(() => {});
                }
                return response;
            }).catch(() => {
                // Offline fallback for navigations.
                if (event.request.mode === 'navigate') {
                    return caches.match('index.html');
                }
            });
        })
    );
});
