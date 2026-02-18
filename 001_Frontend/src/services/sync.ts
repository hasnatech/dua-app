import { db } from './db';
import api from './api';

export const syncService = {
    async syncFromBackend() {
        if (!navigator.onLine) return;

        try {
            console.log('Starting sync from backend...');

            // 1. Fetch Categories
            const categoriesRes = await api.get('/categories');
            if (categoriesRes.data) {
                await db.clear('categories');
                await db.putAll('categories', categoriesRes.data.data || categoriesRes.data);
            }

            // 2. Fetch Duas
            // Assuming endpoint supports fetching all or we paginate. 
            // For now fetch all. If too large, we might need a different strategy.
            const duasRes = await api.get('/duas');
            if (duasRes.data) {
                await db.clear('duas');
                await db.putAll('duas', duasRes.data.data || duasRes.data);
            }

            // 3. Fetch Videos
            const videosRes = await api.get('/videos');
            if (videosRes.data) {
                await db.clear('videos');
                await db.putAll('videos', videosRes.data.data || videosRes.data);
            }

            // Update last sync time
            await db.put('keyval', { key: 'last_sync', value: Date.now() });

            console.log('Sync from backend completed');
        } catch (error) {
            console.error('Sync failed:', error);
            // Don't throw, just log. 
        }
    },

    async processSyncQueue() {
        if (!navigator.onLine) return;

        const queue = await db.getAll('sync_queue');
        if (queue.length === 0) return;

        // Sort by timestamp
        queue.sort((a: any, b: any) => a.timestamp - b.timestamp);

        console.log(`Processing ${queue.length} offline items...`);

        for (const item of queue) {
            try {
                await api.request({
                    method: item.method,
                    url: item.url,
                    data: item.data,
                });
                await db.delete('sync_queue', item.id!);
            } catch (error) {
                console.error('Failed to process offline queue item:', item, error);
                // Keep in queue or move to dead letter queue? 
                // For now keep it.
            }
        }
        console.log('Offline queue processing completed');
    },

    async init() {
        // Initial check
        const lastSync = await db.get('keyval', 'last_sync');
        if (!lastSync) {
            await this.syncFromBackend();
        } else {
            // Maybe sync if older than X time?
            // For now just sync on load if online
            this.syncFromBackend();
        }

        // Process queue
        this.processSyncQueue();

        // Listen for online
        window.addEventListener('online', () => {
            this.syncFromBackend();
            this.processSyncQueue();
        });
    }
};

