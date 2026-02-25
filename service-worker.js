// sw-test.js - Service Worker minimal pour les tests
self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll().then(clients => {
            if (clients.length > 0) {
                clients[0].focus();
            } else {
                clients.openWindow(event.notification.data.url || '/');
            }
        })
    );
});
