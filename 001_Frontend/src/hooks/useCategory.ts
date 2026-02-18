import { useState, useEffect } from 'react';
import { db } from '@/services/db';
import api from '@/services/api';
import type { Category } from '@/types/public';

export function useCategory(id: number | string) {
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                // 1. Try to load from DB
                const numericId = Number(id);
                // Handle bookmark special case if needed, or just look in DB
                if (id === 'bookmarks') {
                    // logic for bookmarks handled in Home usually, but if routed here...
                    // For now assume numeric ID for normal categories
                    setLoading(false);
                    return;
                }

                const localCategory = await db.get('categories', numericId);

                if (localCategory) {
                    setCategory(localCategory);
                    setLoading(false);
                } else {
                    // 2. If empty, fetch from API (Single category fetch?)
                    // Or maybe we should trigger the full sync?
                    // For now, let's try deep link fetch
                    if (navigator.onLine) {
                        const response = await api.get(`/categories/${id}?include=duas`);
                        const data = response.data.data || response.data;
                        if (data) {
                            await db.put('categories', data);
                            setCategory(data);
                        }
                    }
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to load category", err);
                setError("Failed to load category");
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    return { category, loading, error };
}
