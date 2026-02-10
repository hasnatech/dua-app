<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VideoController extends Controller
{
    public function index()
    {
        $videos = Video::latest()->get();
        return Inertia::render('Admin/Videos/Index', [
            'videos' => $videos,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Videos/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:youtube,instagram,video,audio',
            'url' => 'nullable|required_if:type,youtube,instagram|string',
            'file' => 'nullable|required_if:type,video,audio|file|mimes:mp4,mp3,wav,ogg|max:51200', // 50MB max
            'thumbnail' => 'nullable|image|max:2048',
            'description' => 'nullable|string',
        ]);

        $data = $request->only(['title', 'type', 'description']);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('videos', 'public');
            $data['url'] = Storage::url($path);
        } else {
             $data['url'] = $request->url;
        }

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $data['thumbnail'] = Storage::url($path);
        }

        Video::create($data);

        return redirect()->route('admin.videos.index')->with('success', 'Video created successfully.');
    }

    public function edit(Video $video)
    {
        return Inertia::render('Admin/Videos/Edit', [
            'video' => $video,
        ]);
    }

    public function update(Request $request, Video $video)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:youtube,instagram,video,audio',
            'url' => 'nullable|required_if:type,youtube,instagram|string',
            'file' => 'nullable|file|mimes:mp4,mp3,wav,ogg|max:51200',
            'thumbnail' => 'nullable|image|max:2048',
            'description' => 'nullable|string',
        ]);

        $data = $request->only(['title', 'type', 'description']);

        if ($request->hasFile('file')) {
            // Delete old file if it was a local upload
            if (in_array($video->type, ['video', 'audio']) && $video->url) {
                $oldPath = str_replace('/storage/', '', $video->url);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $path = $request->file('file')->store('videos', 'public');
            $data['url'] = Storage::url($path);
        } elseif ($request->url) {
             $data['url'] = $request->url;
        }

        if ($request->hasFile('thumbnail')) {
            if ($video->thumbnail) {
                $oldPath = str_replace('/storage/', '', $video->thumbnail);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $data['thumbnail'] = Storage::url($path);
        }

        $video->update($data);

        return redirect()->route('admin.videos.index')->with('success', 'Video updated successfully.');
    }

    public function destroy(Video $video)
    {
        if (in_array($video->type, ['video', 'audio']) && $video->url) {
            $oldPath = str_replace('/storage/', '', $video->url);
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        if ($video->thumbnail) {
            $oldThumbPath = str_replace('/storage/', '', $video->thumbnail);
             if (Storage::disk('public')->exists($oldThumbPath)) {
                Storage::disk('public')->delete($oldThumbPath);
            }
        }

        $video->delete();

        return redirect()->route('admin.videos.index')->with('success', 'Video deleted successfully.');
    }
}
