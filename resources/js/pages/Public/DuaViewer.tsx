
import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import DuaCard from '@/Components/Public/DuaCard';
import { getBookmarks } from '@/utils/storage';
import { Category, Dua } from '@/types/public'; // Ensure this type is correct

interface DuaViewerProps {
    initialCategories: Category[];
    initialCategoryId: string;
}

const DuaViewer: React.FC<DuaViewerProps> = ({ initialCategories, initialCategoryId }) => {

    // Resolve category and Duas
    const { category, duas } = useMemo(() => {
        if (initialCategoryId === 'bookmarks') {
            const bookmarkIds = getBookmarks();
            const allDuas = initialCategories.flatMap(c => c.duas);
            const bookmarkedDuas = allDuas.filter(d => bookmarkIds.includes(d.id));
            return {
                category: { id: 'bookmarks' as any, name: 'Bookmarked Duas', color: 'bg-amber-500' } as Category,
                duas: bookmarkedDuas
            };
        }
        // Type conversion because URL params are strings but IDs are numbers
        const cat = initialCategories.find(c => c.id == Number(initialCategoryId));
        return { category: cat, duas: cat?.duas || [] };
    }, [initialCategoryId, initialCategories]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    if (!category || duas.length === 0) {
        return (
            <PublicLayout>
                <Head title="Empty Collection" />
                <div className="h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                        <i className="fas fa-heart-broken text-slate-200 text-3xl"></i>
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">Collection Empty</h2>
                    <p className="text-slate-500 text-sm text-center mb-8">You haven't bookmarked any supplications yet.</p>
                    <button
                        onClick={() => router.visit(route('home'))}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
                    >
                        Explore Categories
                    </button>
                </div>
            </PublicLayout>
        );
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentIndex < duas.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else if (isRightSwipe && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const currentDua = duas[currentIndex];

    return (
        <PublicLayout>
            <Head title={category.name} />
            <div
                className="h-screen flex flex-col bg-white overflow-hidden relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Top Header */}
                <div className="px-4 py-3 flex items-center justify-between z-10 bg-white border-b border-slate-50">
                    <button
                        onClick={() => router.visit(route('home'))}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full active:bg-slate-50 transition-colors"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <div className="flex-1 text-center px-4">
                        <h1 className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">{category.name}</h1>
                    </div>
                    <button
                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full active:bg-slate-50 transition-colors"
                        onClick={() => { /* Potential settings or info toggle */ }}
                    >
                        <i className="fas fa-share-nodes"></i>
                    </button>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full flex h-1.5 bg-slate-100 gap-1 px-1">
                    {duas.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-full rounded-full transition-all duration-300 ${idx === currentIndex ? 'flex-[2] bg-emerald-500' : 'flex-1 bg-slate-200'}`}
                        />
                    ))}
                </div>

                {/* Swipeable View Area */}
                <div className="flex-1 relative overflow-hidden bg-white">
                    <div
                        className="absolute inset-0 transition-all duration-300 ease-out"
                        key={currentDua.id} // Trigger animation on key change
                    >
                        <DuaCard dua={currentDua} categoryName={category.name} />
                    </div>
                </div>

                {/* Modern Pagination Navigation */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
                    <div className="flex items-center justify-between pointer-events-auto">
                        <button
                            onClick={() => currentIndex > 0 && setCurrentIndex(prev => prev - 1)}
                            disabled={currentIndex === 0}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm transition-all ${currentIndex === 0 ? 'text-slate-200 border-slate-50' : 'text-slate-600 border-slate-100 bg-white active:scale-90 hover:border-emerald-200'}`}
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>

                        <div className="bg-slate-900/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 text-slate-700 font-bold text-xs tracking-widest shadow-sm">
                            {currentIndex + 1} <span className="opacity-30 mx-1">/</span> {duas.length}
                        </div>

                        <button
                            onClick={() => currentIndex < duas.length - 1 && setCurrentIndex(prev => prev + 1)}
                            disabled={currentIndex === duas.length - 1}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm transition-all ${currentIndex === duas.length - 1 ? 'text-slate-200 border-slate-50' : 'text-emerald-600 border-emerald-100 bg-emerald-50 active:scale-90 hover:bg-emerald-100'}`}
                        >
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default DuaViewer;
