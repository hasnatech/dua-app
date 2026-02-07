
import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/app-layout';
import CategoryForm from '@/Components/Admin/CategoryForm';
import { Category } from '@/types/public';

interface Props {
    category: Category;
}

export default function Edit({ category }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Categories', href: route('admin.categories.index') },
            { title: 'Edit', href: route('admin.categories.edit', category.id) }
        ]}>
            <Head title="Edit Category" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-xl font-semibold mb-6">Edit Category: {category.name}</h2>
                            <CategoryForm
                                category={category}
                                action={route('admin.categories.update', category.id)}
                                submitLabel="Update Category"
                                method="put"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
