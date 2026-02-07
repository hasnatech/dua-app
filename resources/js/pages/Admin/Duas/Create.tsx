
import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/app-layout';
import DuaForm from '@/Components/Admin/DuaForm';
import { Category } from '@/types/public';

interface Props {
    categories: Category[];
}

export default function Create({ categories }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Duas', href: route('admin.duas.index') },
            { title: 'Create', href: route('admin.duas.create') }
        ]}>
            <Head title="Create Dua" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-xl font-semibold mb-6">Create New Dua</h2>
                            <DuaForm
                                categories={categories}
                                action={route('admin.duas.store')}
                                submitLabel="Create Dua"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
