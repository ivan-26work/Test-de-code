// service-worker.js - Notifications Virtual Market

const CACHE_NAME = 'virtual-market-notif-v1';

// Installation
self.addEventListener('install', event => {
    self.skipWaiting();
    console.log('✅ Service Worker Virtual Market installé');
});

// Activation
self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
    console.log('✅ Service Worker Virtual Market activé');
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    const data = notification.data;
    
    notification.close();

    event.waitUntil(
        clients.matchAll().then(clients => {
            // Si une fenêtre est déjà ouverte, la focus
            for (const client of clients) {
                if (client.url === data.url && 'focus' in client) {
                    client.focus();
                    client.postMessage({
                        type: 'NOTIFICATION_CLICKED',
                        commandeId: data.commandeId
                    });
                    return;
                }
            }
            // Sinon, ouvrir une nouvelle fenêtre
            return clients.openWindow(data.url || '/');
        })
    );
});

// Gestion des messages
self.addEventListener('message', event => {
    if (event.data.type === 'CLEAR_NOTIFICATIONS') {
        self.registration.getNotifications().then(notifications => {
            notifications.forEach(notification => notification.close());
        });
    }
});

// Gestion des push (pour plus tard)
self.addEventListener('push', event => {
    const data = event.data.json();
    
    const options = {
        body: data.body || 'Nouvelle commande !',
        icon: 'icon-192.png',
        badge: 'icon-192.png',
        vibrate: [500, 200, 500],
        requireInteraction: true,
        data: {
            url: data.url || '/',
            commandeId: data.commandeId
        }
    };

    event.waitUntil(
        self.registration.showNotification('🛒 Virtual Market', options)
    );
});
