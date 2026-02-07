
import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/app-layout';
import { Category } from '@/types/public'; // Reusing public type for now, add backend specific fields if needed

interface Props {
    categories: Category[];
}

export default function Index({ categories }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('admin.categories.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Categories', href: route('admin.categories.index') }]}>
            <Head title="Manage Categories" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Categories</h2>
                                <Link
                                    href={route('admin.categories.create')}
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
                                >
                                    Add Category
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {categories.map((category) => (
                                            <tr key={category.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{category.sort_order}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`w-8 h-8 rounded flex items-center justify-center text-white ${category.color || 'bg-gray-400'}`}>
                                                        <i className={`fas ${category.icon}`}></i>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium">{category.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{category.slug}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('admin.categories.edit', category.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {categories.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No categories found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
