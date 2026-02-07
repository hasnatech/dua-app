
import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Import() {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        file: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.import.store'));
    };

    return (
        <AppLayout>
            <Head title="Import Duas" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-bold mb-6">Import Duas from JSON</h2>

                            <form onSubmit={submit} className="space-y-6 max-w-xl">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">JSON File</label>
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={e => setData('file', e.target.files ? e.target.files[0] : null)}
                                        className="mt-1 block w-full text-base p-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                    />
                                    {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Importing...' : 'Import Data'}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <h3 className="font-bold text-sm mb-2">Expected JSON Structure:</h3>
                                <pre className="text-xs bg-slate-800 text-slate-200 p-4 rounded overflow-auto">
                                    {`[
  {
    "category": {
      "title": "Category Name",
      "icon": "fa-icon-name",
      "color": "bg-emerald-600"
    },
    "duas": [
      {
        "title": "Dua Title",
        "arabic": "Arabic Text",
        "transliteration": "Transliteration",
        "translation": "English Translation",
        "translation_tamil": "Tamil Translation",
        "when": "When to recite",
        "reference": "Source",
        "benefits": "Virtues"
      }
    ]
  }
]`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
