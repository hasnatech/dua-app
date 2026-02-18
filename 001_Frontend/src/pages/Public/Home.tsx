
import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import CategoryCard from '@/components/Public/CategoryCard';
import { getBookmarks } from '@/utils/storage';
import type { Category } from '@/types/public';
import { usePublicData } from '@/hooks/usePublicData';

const Home: React.FC = () => {
    const { categories: initialCategories, loading } = usePublicData();
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [bookmarkCount, setBookmarkCount] = useState(0);

    // Update categories when data is loaded
    useEffect(() => {
        if (initialCategories) {
            setCategories(initialCategories);
        }
    }, [initialCategories]);

    // Sync bookmark count on mount
    useEffect(() => {
        document.title = "Home - Umrah Companion";
        // Check if running in browser
        if (typeof window !== 'undefined') {
            setBookmarkCount(getBookmarks().length);

            const handleUpdate = () => setBookmarkCount(getBookmarks().length);
            window.addEventListener('bookmarks-updated', handleUpdate);
            return () => window.removeEventListener('bookmarks-updated', handleUpdate);
        }
    }, []);

    const bookmarkCategory: Category | null = useMemo(() => {
        if (bookmarkCount === 0) return null;
        return {
            id: 'bookmarks' as any,
            name: 'Your Bookmarks',
            slug: 'bookmarks',
            description: `Access your ${bookmarkCount} saved supplications`,
            icon: 'fa-bookmark',
            color: 'bg-amber-500',
            sort_order: -1,
            duas: []
        };
    }, [bookmarkCount]);

    const filteredCategories = useMemo(() => {
        return categories.filter(cat =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            cat.duas.some(dua => dua.title.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, categories]);

    if (loading) {
        return (
            <PublicLayout>
                <div className="flex items-center justify-center min-h-screen text-emerald-800">
                    <i className="fas fa-spinner fa-spin text-3xl"></i>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div className="min-h-screen pb-20 bg-slate-50">
                {/* Header Section */}
                <header className="bg-emerald-800 text-white pt-10 pb-20 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                        <i className="fas fa-kaaba text-9xl"></i>
                    </div>

                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Umrah Companion</h1>
                            <p className="text-emerald-200/80 text-sm">Blessed be your journey</p>
                        </div>
                        {/* <Link to="/login" className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center border border-emerald-600 shadow-sm">
                            <i className="fas fa-user-circle text-lg"></i>
                        </Link> */}
                    </div>

                    {/* Search Bar */}
                    <div className="relative z-10">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <i className="fas fa-search text-emerald-300/60"></i>
                        </div>
                        <input
                            type="text"
                            placeholder="Search for a Dua or step..."
                            className="w-full bg-emerald-700/50 border border-emerald-600/50 text-white placeholder:text-emerald-100/40 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-emerald-400/30 transition-all backdrop-blur-md text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                {/* Main Content */}
                <main className="px-5 -mt-8 space-y-4 relative z-20">

                    {/* Bookmarks Section (Special Case) */}
                    {bookmarkCategory && !searchQuery && (
                        <div className="mb-6">
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Personal Collection</h2>
                            <CategoryCard category={bookmarkCategory} />
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-2 px-1">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Supplication Categories</h2>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            {filteredCategories.length} Guides
                        </span>
                    </div>

                    {filteredCategories.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                            {filteredCategories.map(category => (
                                <CategoryCard key={category.id} category={category} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <i className="fas fa-search text-slate-200 text-2xl"></i>
                            </div>
                            <p className="text-slate-400 text-sm font-medium">No results for "{searchQuery}"</p>
                        </div>
                    )}
                </main>

                {/* Quick Access Icons */}
                <section className="px-6 mt-10 grid grid-cols-4 gap-4 pb-10">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center text-emerald-600">
                            <i className="fas fa-clock"></i>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Times</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center text-blue-500">
                            <i className="fas fa-compass"></i>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Qibla</span>
                    </div>
                    <Link to="/videos" className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center text-amber-500">
                            <i className="fas fa-play-circle"></i>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Video</span>
                    </Link>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center text-rose-500">
                            <i className="fas fa-location-dot"></i>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Places</span>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
};

export default Home;
