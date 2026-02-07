
import React from 'react';
import { useForm } from '@inertiajs/react';
import { Category, Dua } from '@/types/public';

interface Props {
    dua?: Dua;
    categories: Category[];
    submitLabel: string;
    action: string;
    method?: 'post' | 'put' | 'patch';
}

export default function DuaForm({ dua, categories, submitLabel, action, method = 'post' }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        category_id: dua?.category_id || (categories.length > 0 ? categories[0].id : ''),
        title: dua?.title || '',
        arabic: dua?.arabic || '',
        transliteration: dua?.transliteration || '',
        translation: dua?.translation || '',
        translation_tamil: dua?.translation_tamil || '',
        when: dua?.when || '',
        reference: dua?.reference || '',
        benefits: dua?.benefits || '',
        audio_url: dua?.audio_url || '',
        sort_order: dua?.sort_order || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (method === 'put') {
            put(action);
        } else {
            post(action);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                    value={data.category_id}
                    onChange={e => setData('category_id', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-base p-3"
                >
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-base p-3"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Arabic</label>
                <textarea
                    value={data.arabic}
                    onChange={e => setData('arabic', e.target.value)}
                    rows={3}
                    dir="rtl"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 font-arabic text-2xl p-3"
                />
                {errors.arabic && <p className="mt-1 text-sm text-red-600">{errors.arabic}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Transliteration</label>
                <textarea
                    value={data.transliteration}
                    onChange={e => setData('transliteration', e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-base p-3"
                />
                {errors.transliteration && <p className="mt-1 text-sm text-red-600">{errors.transliteration}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Translation</label>
                <textarea
                    value={data.translation}
                    onChange={e => setData('translation', e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-base p-3"
                />
                {errors.translation && <p className="mt-1 text-sm text-red-600">{errors.translation}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Translation (Tamil)</label>
                <textarea
                    value={data.translation_tamil}
                    onChange={e => setData('translation_tamil', e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-base p-3"
                />
                {errors.translation_tamil && <p className="mt-1 text-sm text-red-600">{errors.translation_tamil}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">When to Recite</label>
                <textarea
                    value={data.when}
                    onChange={e => setData('when', e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-base p-3"
                    placeholder="e.g., Drink Zam Zam while standing..."
                />
                {errors.when && <p className="mt-1 text-sm text-red-600">{errors.when}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Reference</label>
                    <input
                        type="text"
                        value={data.reference}
                        onChange={e => setData('reference', e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-base p-3"
                    />
                    {errors.reference && <p className="mt-1 text-sm text-red-600">{errors.reference}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Benefits</label>
                    <input
                        type="text"
                        value={data.benefits}
                        onChange={e => setData('benefits', e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-base p-3"
                    />
                    {errors.benefits && <p className="mt-1 text-sm text-red-600">{errors.benefits}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Audio URL</label>
                <input
                    type="url"
                    value={data.audio_url}
                    onChange={e => setData('audio_url', e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-base p-3"
                />
                {errors.audio_url && <p className="mt-1 text-sm text-red-600">{errors.audio_url}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                <input
                    type="number"
                    value={data.sort_order}
                    onChange={e => setData('sort_order', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-base p-3"
                />
                {errors.sort_order && <p className="mt-1 text-sm text-red-600">{errors.sort_order}</p>}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
