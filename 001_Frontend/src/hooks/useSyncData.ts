import { useState, useCallback } from 'react';
import { db } from '@/services/db';
import api from '@/services/api';

export function useSyncData() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState<string>('Initializing...');

    const checkLocalData = useCallback(async () => {
        try {
            const count = await db.count('categories');
            return count > 0;
        } catch (err) {
            console.error('Failed to check local data', err);
            return false;
        }
    }, []);

    const syncAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        setProgress(0);
        setStatusMessage('Connecting to server...');

        try {
            // 1. Fetch Categories (with Duas included if API supports it, or fetch separately)
            // Assuming the API structure from usePublicData suggestion: /categories?include=duas
            setStatusMessage('Fetching content...');
            const response = await api.get('/categories?include=duas');
            const categories = response.data.data || response.data;

            if (categories) {
                setStatusMessage('Saving to local database...');
                await db.clear('categories');
                // Also clear duas if they are being re-synced, or handle smart merging
                await db.clear('duas');

                await db.putAll('categories', categories);

                // If the API returns duas nested in categories, flatten and save them
                const allDuas: any[] = [];
                categories.forEach((cat: any) => {
                    if (cat.duas) {
                        cat.duas.forEach((dua: any) => {
                            allDuas.push({ ...dua, category_id: cat.id });
                        });
                    }
                });

                if (allDuas.length > 0) {
                    await db.putAll('duas', allDuas);
                    setStatusMessage(`Saved ${allDuas.length} duas locally.`);
                }
            }

            setProgress(50);
            setStatusMessage('Finalizing sync...');

            // 2. Fetch Videos
            setStatusMessage('Fetching videos...');
            try {
                const videoResponse = await api.get('/videos');
                const videos = videoResponse.data.data || videoResponse.data;
                if (videos) {
                    await db.clear('videos');
                    await db.putAll('videos', videos);
                    setStatusMessage(`Saved ${videos.length} videos locally.`);
                }
            } catch (videoErr) {
                console.warn('Failed to fetch videos', videoErr);
                // Continue sync even if videos fail
            }

            setProgress(100);
            setStatusMessage('Complete!');
            setLoading(false);
            return true;
        } catch (err: any) {
            console.error('Sync failed', err);
            setError(err.message || 'Failed to sync data');
            setStatusMessage('Sync failed.');
            setLoading(false);
            return false;
        }
    }, []);

    return { loading, error, progress, statusMessage, checkLocalData, syncAll };
}
