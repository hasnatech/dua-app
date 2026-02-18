
export interface Dua {
    id: number; // Changed from string to number as database ID
    category_id: number;
    title: string;
    arabic: string;
    transliteration: string | null;
    translation: string | null;
    translation_tamil: string | null;
    when: string | null;
    reference: string | null;
    benefits: string | null;
    audio_url: string | null;
    sort_order: number;
    // created_at and updated_at omitted for now
}

export interface Category {
    id: number; // Changed from string to number
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    sort_order: number;
    duas: Dua[]; // Nested duas
}
