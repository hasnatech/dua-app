
import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface Video {
    id: number;
    title: string;
    type: 'youtube' | 'instagram' | 'video' | 'audio';
    url: string;
    thumbnail: string | null;
    duration: string | null;
    description: string | null;
}

interface Props {
    videos: Video[];
}

export default function Index({ videos }: Props) {
    const [activeTab, setActiveTab] = useState<'all' | 'video' | 'audio'>('all');
    const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

    const filteredVideos = useMemo(() => {
        if (activeTab === 'all') return videos;
        if (activeTab === 'audio') return videos.filter(v => v.type === 'audio');
        return videos.filter(v => v.type !== 'audio'); // 'video', 'youtube', 'instagram'
    }, [videos, activeTab]);

    const getThumbnail = (video: Video) => {
        if (video.thumbnail) return video.thumbnail;
        if (video.type === 'youtube') {
            // Try to extract ID (basic regex)
            const match = video.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
            if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
        }
        return null;
    };

    const handlePlay = (video: Video) => {
        setPlayingVideo(video);
    };

    const closePlayer = () => {
        setPlayingVideo(null);
    };

    return (
        <PublicLayout>
            <Head title="Media Library" />
            <div className="min-h-screen pb-20 bg-slate-50">
                {/* Header */}
                <header className="bg-emerald-800 text-white pt-10 pb-6 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                        <i className="fas fa-play-circle text-9xl"></i>
                    </div>
                    <div className="flex items-center mb-6 relative z-10">
                        <Link href={route('home')} className="mr-4 w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center">
                            <i className="fas fa-arrow-left"></i>
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 bg-emerald-900/40 rounded-xl backdrop-blur-sm relative z-10">
                        {['all', 'video', 'audio'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                        ? 'bg-white text-emerald-800 shadow-sm'
                                        : 'text-emerald-100 hover:bg-emerald-700/50'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Content */}
                <main className="px-5 mt-6 space-y-4">
                    {filteredVideos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredVideos.map(video => (
                                <div key={video.id} onClick={() => handlePlay(video)} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-emerald-200 transition-all active:scale-[0.98]">
                                    <div className="relative aspect-video rounded-xl bg-slate-100 overflow-hidden mb-3 group">
                                        {getThumbnail(video) ? (
                                            <img src={getThumbnail(video)!} alt={video.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <i className={`fas fa-${video.type === 'audio' ? 'music' : 'video'} text-3xl`}></i>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-all">
                                            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-emerald-600 shadow-lg">
                                                <i className={`fas fa-${video.type === 'audio' ? 'play' : 'play'} ml-0.5`}></i>
                                            </div>
                                        </div>

                                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 rounded text-[10px] font-bold text-white backdrop-blur-md uppercase">
                                            {video.type}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-700 leading-snug line-clamp-2 mb-1">{video.title}</h3>
                                        {video.description && (
                                            <p className="text-xs text-slate-400 line-clamp-1">{video.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <i className="fas fa-film text-slate-200 text-2xl"></i>
                            </div>
                            <p className="text-slate-400 text-sm font-medium">No media found for "{activeTab}"</p>
                        </div>
                    )}
                </main>

                {/* Player Modal */}
                {playingVideo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={closePlayer}>
                        <div className="w-full max-w-3xl bg-black rounded-2xl overflow-hidden relative shadow-2xl" onClick={e => e.stopPropagation()}>
                            <button onClick={closePlayer} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                                <i className="fas fa-times"></i>
                            </button>

                            <div className="aspect-video w-full bg-black flex items-center justify-center">
                                {playingVideo.type === 'youtube' && (() => {
                                    const match = playingVideo.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
                                    const videoId = match ? match[1] : '';
                                    return (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                                            title={playingVideo.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    );
                                })()}

                                {playingVideo.type === 'instagram' && (
                                    <div className="text-white text-center p-8">
                                        <p className="mb-4">Instagram embeds require external script loading which might be blocked.</p>
                                        <a href={playingVideo.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-full font-bold">
                                            Open in Instagram
                                        </a>
                                    </div>
                                )}

                                {(playingVideo.type === 'video' || playingVideo.type === 'audio') && (
                                    <video
                                        src={playingVideo.url}
                                        controls
                                        autoPlay
                                        className="w-full h-full"
                                        poster={playingVideo.thumbnail || undefined}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>

                            <div className="p-4 bg-slate-900 text-white">
                                <h3 className="font-bold text-lg">{playingVideo.title}</h3>
                                {playingVideo.description && <p className="text-sm text-slate-400 mt-1">{playingVideo.description}</p>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
