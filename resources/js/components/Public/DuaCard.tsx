
import React, { useEffect, useState } from 'react';
import { Dua } from '@/types/public';
import { isBookmarked, toggleBookmark } from '@/utils/storage';

interface DuaCardProps {
    dua: Dua;
    categoryName: string;
}

const DuaCard: React.FC<DuaCardProps> = ({ dua, categoryName }) => {
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        setBookmarked(isBookmarked(dua.id));
    }, [dua.id]);

    const handleBookmarkToggle = () => {
        toggleBookmark(dua.id);
        setBookmarked(!bookmarked);
    };

    return (
        <div className="flex flex-col h-full w-full bg-white text-slate-900 relative">
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-6 pb-24">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 text-center pl-8">
                        <span className="text-emerald-600 font-semibold text-xs uppercase tracking-widest">{categoryName}</span>
                        <h2 className="text-2xl font-bold text-slate-800 mt-2 leading-tight">{dua.title}</h2>
                    </div>
                    <button
                        onClick={handleBookmarkToggle}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${bookmarked ? 'bg-amber-100 text-amber-600 shadow-inner' : 'bg-slate-50 text-slate-300 hover:text-slate-400'}`}
                    >
                        <i className={`fa-bookmark ${bookmarked ? 'fas' : 'far'} text-lg`}></i>
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Arabic Text */}
                    <div className="bg-emerald-50/40 p-3 text-center border border-emerald-50 -mx-5">
                        <p className="font-arabic text-3xl leading-[2.5] text-slate-900 dir-rtl" dir="rtl">
                            {dua.arabic}
                        </p>
                    </div>

                    {/* Transliteration */}
                    {dua.transliteration && (
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transliteration</h4>
                            <p className="text-slate-600 italic leading-relaxed text-lg">
                                {dua.transliteration}
                            </p>
                        </div>
                    )}

                    {/* Translation */}
                    {dua.translation && (
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Translation</h4>
                            <p className="text-slate-800 font-medium leading-relaxed text-lg">
                                {dua.translation}
                            </p>
                        </div>
                    )}

                    {/* Tamil Translation */}
                    {dua.translation_tamil && (
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tamil Translation</h4>
                            <p className="text-slate-800 font-medium leading-relaxed text-lg">
                                {dua.translation_tamil}
                            </p>
                        </div>
                    )}

                    {/* When to Recite */}
                    {dua.when && (
                        <div className="flex gap-3 items-start bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                            <div className="w-6 h-6 mt-0.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <i className="fas fa-clock text-[10px]"></i>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">When to Recite</h4>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    {dua.when}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Benefits / Reference */}
                    {(dua.benefits || dua.reference) && (
                        <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4">
                            {dua.benefits && (
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                        <i className="fas fa-heart text-[10px]"></i>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        <span className="font-bold">Benefit:</span> {dua.benefits}
                                    </p>
                                </div>
                            )}
                            {dua.reference && (
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                                        <i className="fas fa-book text-[10px]"></i>
                                    </div>
                                    <p className="text-xs text-slate-500 italic">
                                        Source: {dua.reference}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DuaCard;
