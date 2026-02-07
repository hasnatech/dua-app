
import React from 'react';
import { Category } from '@/types/public';
import { router } from '@inertiajs/react';

interface CategoryCardProps {
    category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {

    return (
        <button
            onClick={() => router.visit(route('dua.viewer', category.id))}
            className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left group"
        >
            <div className={`w-14 h-14 rounded-xl ${category.color || 'bg-emerald-600'} flex items-center justify-center text-white shrink-0`}>
                <i className={`fas ${category.icon || 'fa-star'} text-xl`}></i>
            </div>
            <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-slate-800 text-lg truncate group-hover:text-emerald-700 transition-colors">
                    {category.name}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-1">
                    {category.description}
                </p>
            </div>
            <div className="text-slate-300 group-hover:text-slate-500 transition-colors">
                <i className="fas fa-chevron-right"></i>
            </div>
        </button>
    );
};

export default CategoryCard;
