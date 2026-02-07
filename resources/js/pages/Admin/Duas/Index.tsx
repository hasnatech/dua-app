
import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/app-layout';
import { Dua, Category } from '@/types/public'; // Extend Dua type to include category relation if needed

interface DuaWithCategory extends Dua {
    category: Category;
}

interface Props {
    duas: DuaWithCategory[];
    categories: Category[];
}

export default function Index({ duas, categories }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this Dua?')) {
            router.delete(route('admin.duas.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Duas', href: route('admin.duas.index') }]}>
            <Head title="Manage Duas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Duas</h2>
                                <Link
                                    href={route('admin.duas.create')} // Ensure route exists or point to shared create if needed
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
                                >
                                    Add Dua
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arabic</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {duas.map((dua) => (
                                            <tr key={dua.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{dua.sort_order}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                                                        {dua.category?.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-sm">{dua.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap font-arabic text-lg text-right" dir="rtl">{dua.arabic.substring(0, 30)}...</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('admin.duas.edit', dua.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(dua.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {duas.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No duas found.</td>
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
