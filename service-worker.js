// service-worker.js
const CACHE_NAME = 'virtua-market-v1';

// Installation
self.addEventListener('install', event => {
    self.skipWaiting();
    console.log('Service Worker Virtua Market installé');
});

// Activation
self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
    console.log('Service Worker Virtua Market activé');
});

// Gestion des notifications
self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    const action = event.action;
    const data = notification.data;
    
    notification.close();

    // Gérer les différentes actions
    if (action === 'open') {
        // Ouvrir l'application
        event.waitUntil(
            clients.openWindow('https://ivan-26work.github.io/Test-de-code/')
        );
    }
    else if (action === 'clear') {
        // Marquer comme lu - envoyer un message à l'application
        event.waitUntil(
            clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'CLEAR_BADGE',
                        data: data
                    });
                });
            })
        );
    }
    else {
        // Clic sur la notification elle-même
        event.waitUntil(
            clients.openWindow('https://ivan-26work.github.io/Test-de-code/')
        );
    }
});

// Gestion des messages de l'application
self.addEventListener('message', event => {
    if (event.data.type === 'CLEAR_NOTIFICATIONS') {
        // Fermer toutes les notifications avec un certain tag
        self.registration.getNotifications().then(notifications => {
            notifications.forEach(notification => {
                if (notification.tag === event.data.tag) {
                    notification.close();
                }
            });
        });
    }
});

// Gestion des notifications push (pour plus tard)
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Nouvelle notification Virtua Market',
        icon: 'icon-512.png',
        badge: 'icon-192.png',
        vibrate: [200, 100, 200],
        actions: [
            {
                action: 'open',
                title: '📱 Ouvrir'
            },
            {
                action: 'clear',
                title: '✅ Marquer comme lu'
            }
        ],
        data: {
            timestamp: Date.now(),
            appName: 'Virtua Market'
        }
    };

    event.waitUntil(
        self.registration.showNotification('Virtua Market', options)
    );
});
