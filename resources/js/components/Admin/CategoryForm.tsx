
import React from 'react';
import { useForm } from '@inertiajs/react';
import { Category } from '@/types/public';

interface Props {
    category?: Category;
    submitLabel: string;
    action: string;
    method?: 'post' | 'put' | 'patch';
}

export default function CategoryForm({ category, submitLabel, action, method = 'post' }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        slug: category?.slug || '',
        description: category?.description || '',
        icon: category?.icon || 'fa-star',
        color: category?.color || 'bg-emerald-600',
        sort_order: category?.sort_order || 0,
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
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={e => {
                        const name = e.target.value;
                        setData(data => ({
                            ...data,
                            name: name,
                            slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                        }));
                    }}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-base p-3"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input
                    type="text"
                    value={data.slug}
                    onChange={e => setData('slug', e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-base p-3"
                />
                {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-base p-3"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Icon (FontAwesome Class)</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            type="text"
                            value={data.icon}
                            onChange={e => setData('icon', e.target.value)}
                            className="block w-full rounded-none rounded-l-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-base p-3"
                        />
                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 text-base">
                            <i className={`fas ${data.icon}`}></i>
                        </span>
                    </div>
                    {errors.icon && <p className="mt-1 text-sm text-red-600">{errors.icon}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Color (Tailwind Class)</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            type="text"
                            value={data.color}
                            onChange={e => setData('color', e.target.value)}
                            className="block w-full rounded-none rounded-l-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-base p-3"
                        />
                        <span className={`inline-flex items-center rounded-r-md border border-l-0 border-gray-300 px-3 text-white sm:text-sm ${data.color}`}>
                            Color
                        </span>
                    </div>
                    {errors.color && <p className="mt-1 text-sm text-red-600">{errors.color}</p>}
                </div>
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
