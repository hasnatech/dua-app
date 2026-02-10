
import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/app-layout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        type: 'youtube', // default
        url: '',
        file: null as File | null,
        thumbnail: null as File | null,
        description: '',
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.videos.store'));
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Videos', href: route('admin.videos.index') },
            { title: 'Add Media', href: '#' }
        ]}>
            <Head title="Add New Media" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 text-gray-900 space-y-6">

                            {/* Title */}
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Title</label>
                                <input
                                    type="text"
                                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm mt-1 block w-full"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Type</label>
                                <select
                                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm mt-1 block w-full"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value as any)}
                                >
                                    <option value="youtube">YouTube</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="video">Upload Video (MP4)</option>
                                    <option value="audio">Upload Audio (MP3/WAV)</option>
                                </select>
                                {errors.type && <div className="text-red-500 text-sm mt-1">{errors.type}</div>}
                            </div>

                            {/* URL or File Upload */}
                            {['youtube', 'instagram'].includes(data.type) ? (
                                <div>
                                    <label className="block font-medium text-sm text-gray-700">
                                        {data.type === 'youtube' ? 'YouTube URL' : 'Instagram URL'}
                                    </label>
                                    <input
                                        type="url"
                                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm mt-1 block w-full"
                                        value={data.url}
                                        onChange={(e) => setData('url', e.target.value)}
                                        placeholder={data.type === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://instagram.com/p/...'}
                                        required
                                    />
                                    {errors.url && <div className="text-red-500 text-sm mt-1">{errors.url}</div>}
                                </div>
                            ) : (
                                <div>
                                    <label className="block font-medium text-sm text-gray-700">
                                        Upload File ({data.type === 'video' ? 'MP4' : 'MP3, WAV'})
                                    </label>
                                    <div className="mt-1 flex items-center">
                                        <input
                                            type="file"
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                            onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                            accept={data.type === 'video' ? 'video/mp4' : 'audio/*'}
                                            required
                                        />
                                    </div>
                                    {errors.file && <div className="text-red-500 text-sm mt-1">{errors.file}</div>}
                                </div>
                            )}

                            {/* Thumbnail */}
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Thumbnail (Optional)</label>
                                <div className="mt-1 flex items-center gap-4">
                                    <input
                                        type="file"
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                        onChange={handleThumbnailChange}
                                        accept="image/*"
                                    />
                                </div>
                                {previewUrl && (
                                    <div className="mt-2 text-sm text-gray-500">
                                        <p className="mb-1">Preview:</p>
                                        <img src={previewUrl} alt="Thumbnail preview" className="h-24 w-auto rounded border" />
                                    </div>
                                )}
                                {errors.thumbnail && <div className="text-red-500 text-sm mt-1">{errors.thumbnail}</div>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Description</label>
                                <textarea
                                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm mt-1 block w-full h-24"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                            </div>

                            <div className="flex items-center justify-end">
                                <Link href={route('admin.videos.index')} className="text-gray-600 hover:text-gray-900 mr-4">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
                                    disabled={processing}
                                >
                                    {processing ? 'Saving...' : 'Save Media'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
