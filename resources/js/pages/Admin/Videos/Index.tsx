
import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/app-layout';

interface Video {
    id: number;
    title: string;
    type: 'youtube' | 'instagram' | 'video' | 'audio';
    url: string;
    thumbnail: string | null;
    is_active: boolean;
}

interface Props {
    videos: Video[];
}

export default function Index({ videos }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this video?')) {
            router.delete(route('admin.videos.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Videos', href: route('admin.videos.index') }]}>
            <Head title="Manage Videos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Videos & Media</h2>
                                <Link
                                    href={route('admin.videos.create')}
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
                                >
                                    Add New Media
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {videos.map((video) => (
                                            <tr key={video.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="w-16 h-9 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                                        {video.thumbnail ? (
                                                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <i className={`fas fa-${video.type === 'audio' ? 'music' : 'video'} text-gray-400`}></i>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium">{video.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${video.type === 'youtube' ? 'bg-red-100 text-red-800' : ''}
                                                        ${video.type === 'instagram' ? 'bg-pink-100 text-pink-800' : ''}
                                                        ${video.type === 'video' ? 'bg-blue-100 text-blue-800' : ''}
                                                        ${video.type === 'audio' ? 'bg-purple-100 text-purple-800' : ''}
                                                    `}>
                                                        {video.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 max-w-xs truncate">
                                                    {video.url}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('admin.videos.edit', video.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(video.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {videos.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No media found.</td>
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
