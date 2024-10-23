const CACHE_NAME = 'todo-app-cache-v1';
const urlsToCache = [
    '/HexSoftwares_To_Do_List_App/index.html',
    '/HexSoftwares_To_Do_List_App/css/styles.css',
    '/HexSoftwares_To_Do_List_App/js/index.js',
    '/HexSoftwares_To_Do_List_App/assets/todo.png',
];

// Install the service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(
                urlsToCache.map((url) => {
                    return cache.add(url).catch((err) => {
                        console.error(`Failed to cache ${url}:`, err);
                    });
                })
            );
        })
    );
});


// Fetch event to serve cached files
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response from cache
                return response || fetch(event.request);
            })
    );
});

// Activate event to clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
