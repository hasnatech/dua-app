
import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/app-layout';
import CategoryForm from '@/Components/Admin/CategoryForm';

export default function Create() {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Categories', href: route('admin.categories.index') },
            { title: 'Create', href: route('admin.categories.create') }
        ]}>
            <Head title="Create Category" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-xl font-semibold mb-6">Create New Category</h2>
                            <CategoryForm
                                action={route('admin.categories.store')}
                                submitLabel="Create Category"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
