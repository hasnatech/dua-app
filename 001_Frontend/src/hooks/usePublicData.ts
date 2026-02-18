import { useState, useEffect } from 'react';
import { db } from '@/services/db';
import api from '@/services/api';
import type { Category } from '@/types/public';

export function usePublicData() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Try to load from DB
                const localCategories = await db.getAll('categories');

                if (localCategories && localCategories.length > 0) {
                    setCategories(localCategories);
                    setLoading(false);
                    // Optional: Background refresh if online
                    if (navigator.onLine) {
                        fetchAndSave();
                    }
                } else {
                    // 2. If empty, fetch from API
                    if (navigator.onLine) {
                        await fetchAndSave();
                    } else {
                        setLoading(false);
                    }
                }
            } catch (err) {
                console.error("Failed to load data", err);
                setError("Failed to load data");
                setLoading(false);
            }
        };

        const fetchAndSave = async () => {
            try {
                // Assuming API endpoint returns all categories with duas
                const response = await api.get('/categories?include=duas');
                const data = response.data.data || response.data; // Adjust based on API structure

                if (data) {
                    await db.clear('categories'); // Clear old data? Or merge?
                    await db.putAll('categories', data);
                    setCategories(data);
                }
            } catch (err) {
                console.error("Background sync failed", err);
                // Don't set error state if we already have local data
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { categories, loading, error };
}
