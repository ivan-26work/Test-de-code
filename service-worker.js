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

// Gestion des clics sur les notifications (appels)
self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    const action = event.action;
    const data = notification.data;
    
    notification.close();

    // Gérer les actions de l'appel
    if (action === 'answer') {
        // Répondre à l'appel
        event.waitUntil(
            clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'ANSWER_CALL',
                        data: data
                    });
                });
            }).then(() => {
                // Ouvrir l'application
                return clients.openWindow('https://ivan-26work.github.io/Test-de-code/');
            })
        );
    }
    else if (action === 'ignore') {
        // Ignorer l'appel
        event.waitUntil(
            clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'IGNORE_CALL',
                        data: data
                    });
                });
            })
        );
    }
    else {
        // Clic sur la notification elle-même (répondre par défaut)
        event.waitUntil(
            clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'ANSWER_CALL',
                        data: data
                    });
                });
            }).then(() => {
                return clients.openWindow('https://ivan-26work.github.io/Test-de-code/');
            })
        );
    }
});

// Gestion des messages
self.addEventListener('message', event => {
    if (event.data.type === 'CLEAR_NOTIFICATIONS') {
        self.registration.getNotifications().then(notifications => {
            notifications.forEach(notification => {
                if (notification.tag === event.data.tag) {
                    notification.close();
                }
            });
        });
    }
});

// Gestion des push (pour plus tard)
self.addEventListener('push', event => {
    const options = {
        body: '📞 Appel entrant de Virtua Market',
        icon: 'icon-512.png',
        badge: 'icon-192.png',
        vibrate: [1000, 500, 1000, 500, 1000, 500, 1000],
        requireInteraction: true,
        actions: [
            {
                action: 'answer',
                title: '📞 Répondre'
            },
            {
                action: 'ignore',
                title: '❌ Ignorer'
            }
        ],
        data: {
            timestamp: Date.now(),
            appName: 'Virtua Market',
            type: 'call'
        }
    };

    event.waitUntil(
        self.registration.showNotification('📞 Appel entrant - Virtua Market', options)
    );
});
