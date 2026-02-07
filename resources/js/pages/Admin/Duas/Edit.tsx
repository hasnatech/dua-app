
import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/app-layout';
import DuaForm from '@/Components/Admin/DuaForm';
import { Category, Dua } from '@/types/public';

interface Props {
    dua: Dua;
    categories: Category[];
}

export default function Edit({ dua, categories }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Duas', href: route('admin.duas.index') },
            { title: 'Edit', href: route('admin.duas.edit', dua.id) }
        ]}>
            <Head title="Edit Dua" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-xl font-semibold mb-6">Edit Dua: {dua.title}</h2>
                            <DuaForm
                                dua={dua}
                                categories={categories}
                                action={route('admin.duas.update', dua.id)}
                                submitLabel="Update Dua"
                                method="put"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
