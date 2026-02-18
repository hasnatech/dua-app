import { openDB, type DBSchema } from 'idb';

interface DuaAppDB extends DBSchema {
    keyval: {
        key: string;
        value: any;
    };
    categories: {
        key: number;
        value: any; // Replace with Category type
        indexes: { 'by-name': string };
    };
    duas: {
        key: number;
        value: any; // Replace with Dua type
        indexes: { 'by-category': number };
    };
    videos: {
        key: number;
        value: any;
        indexes: { 'by-type': string };
    };
    sync_queue: {
        key: number;
        value: {
            id?: number;
            url: string;
            method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
            data?: any;
            timestamp: number;
        };
        indexes: { 'by-timestamp': number };
    };
}

const DB_NAME = 'dua-app-db';
const DB_VERSION = 2; // Increment version

export const initDB = async () => {
    return openDB<DuaAppDB>(DB_NAME, DB_VERSION, {
        upgrade(db, _oldVersion, _newVersion, _transaction) {
            // Key-Value store
            if (!db.objectStoreNames.contains('keyval')) {
                db.createObjectStore('keyval');
            }

            // Categories
            if (!db.objectStoreNames.contains('categories')) {
                const store = db.createObjectStore('categories', { keyPath: 'id' });
                store.createIndex('by-name', 'name');
            }

            // Duas
            if (!db.objectStoreNames.contains('duas')) {
                const store = db.createObjectStore('duas', { keyPath: 'id' });
                store.createIndex('by-category', 'category_id');
            }

            // Videos
            if (!db.objectStoreNames.contains('videos')) {
                const store = db.createObjectStore('videos', { keyPath: 'id' });
                store.createIndex('by-type', 'type');
            }

            // Sync Queue
            if (!db.objectStoreNames.contains('sync_queue')) {
                const store = db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
                store.createIndex('by-timestamp', 'timestamp');
            }
        },
    });
};

export const db = {
    get: async (store: any, key: IDBValidKey) => (await initDB()).get(store as any, key),
    getAll: async (store: any) => (await initDB()).getAll(store as any),
    // @ts-ignore
    getAllFromIndex: async (store: any, index: any, key: IDBValidKey) => (await initDB()).getAllFromIndex(store as any, index as any, key),
    put: async (store: any, val: any) => (await initDB()).put(store as any, val),
    putAll: async (store: any, values: any[]) => {
        const db = await initDB();
        const tx = db.transaction(store as any, 'readwrite');
        const promises = values.map(v => tx.store.put(v));
        await Promise.all([...promises, tx.done]);
    },
    count: async (store: any) => (await initDB()).count(store as any),
    delete: async (store: any, key: IDBValidKey) => (await initDB()).delete(store as any, key),
    clear: async (store: any) => (await initDB()).clear(store as any),
};

