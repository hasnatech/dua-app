import { useCategory } from '@/hooks/useCategory';
import PublicLayout from '@/layouts/PublicLayout';
import { Link, useParams } from 'react-router-dom';

export default function Show() {
    const { id } = useParams<{ id: string }>();
    const { category, loading } = useCategory(id || '');

    if (loading) {
        return (
            <PublicLayout>
                <div className="flex items-center justify-center min-h-screen text-emerald-800">
                    <i className="fas fa-spinner fa-spin text-3xl"></i>
                </div>
            </PublicLayout>
        );
    }

    if (!category) {
        return (
            <PublicLayout>
                <div className="flex flex-col items-center justify-center min-h-screen text-slate-500">
                    <p>Category not found</p>
                    <Link to="/" className="text-emerald-600 font-bold mt-4">Go Home</Link>
                </div>
            </PublicLayout>
        );
    }

    // Set title safely
    document.title = `${category.name} - Umrah Companion`;

    return (
        <PublicLayout>
            <div className="min-h-screen pb-20 bg-slate-50">
                {/* Header Section */}
                <header className={`pt-10 pb-20 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden bg-emerald-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                        <i className={`fas ${category.icon || 'fa-star'} text-9xl text-white`}></i>
                    </div>

                    <div className="flex items-center mb-6 relative z-10 text-white">
                        <Link to="/" className="mr-4 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                            <i className="fas fa-arrow-left"></i>
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight">{category.name}</h1>
                    </div>

                    {category.description && (
                        <p className="text-white/80 relative z-10 text-sm leading-relaxed max-w-sm">
                            {category.description}
                        </p>
                    )}
                </header>

                {/* Main Content - Dua List */}
                <main className="px-5 -mt-8 space-y-3 relative z-20">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                        {category.duas && category.duas.length > 0 ? (
                            category.duas.map((dua, index) => (
                                <Link
                                    key={dua.id}
                                    to={`/dua/${dua.id}?categoryId=${category.id}`}
                                    className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 font-bold flex items-center justify-center text-xs group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-700 text-sm mb-0.5 group-hover:text-emerald-700 transition-colors">{dua.title}</h3>
                                        <p className="text-xs text-slate-400 line-clamp-1 italic">{(dua.translation || '').substring(0, 60)}...</p>
                                    </div>
                                    <div className="text-slate-300 group-hover:text-emerald-400">
                                        <i className="fas fa-chevron-right text-xs"></i>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                <i className="fas fa-scroll text-3xl mb-3 opacity-50"></i>
                                <p>No Duas found in this category.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </PublicLayout>
    );
}
