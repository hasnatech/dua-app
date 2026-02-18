<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DuaController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $duas = \App\Models\Dua::with('category')->orderBy('sort_order')->get();
        $categories = \App\Models\Category::select('id', 'name')->orderBy('name')->get();

        return \Inertia\Inertia::render('Admin/Duas/Index', [
            'duas' => $duas,
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function create()
    {
        $categories = \App\Models\Category::select('id', 'name')->orderBy('name')->get();
        return \Inertia\Inertia::render('Admin/Duas/Create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'arabic' => 'required|string',
            'transliteration' => 'nullable|string',
            'translation' => 'nullable|string',
            'translation_tamil' => 'nullable|string',
            'reference' => 'nullable|string',
            'benefits' => 'nullable|string',
            'audio_file' => 'nullable|file|mimes:mp3|max:10240', // 10MB Max
            'sort_order' => 'integer'
        ]);

        if ($request->hasFile('audio_file')) {
            $path = $request->file('audio_file')->store('audio', 'public');
            $validated['audio_url'] = '/storage/' . $path;
        }

        unset($validated['audio_file']); // Remove file from array before creating model

        \App\Models\Dua::create($validated);

        return redirect()->route('admin.duas.index')->with('success', 'Dua created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function edit(string $id)
    {
        $dua = \App\Models\Dua::findOrFail($id);
        $categories = \App\Models\Category::select('id', 'name')->orderBy('name')->get();
        
        return \Inertia\Inertia::render('Admin/Duas/Edit', [
            'dua' => $dua,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $dua = \App\Models\Dua::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'arabic' => 'required|string',
            'transliteration' => 'nullable|string',
            'translation' => 'nullable|string',
            'translation_tamil' => 'nullable|string',
            'reference' => 'nullable|string',
            'benefits' => 'nullable|string',
            'audio_file' => 'nullable|file|mimes:mp3|max:10240',
            'sort_order' => 'integer'
        ]);

        if ($request->hasFile('audio_file')) {
            // Optional: Delete old file if exists
            if ($dua->audio_url) {
                $oldPath = str_replace('/storage/', '', $dua->audio_url);
                if (\Illuminate\Support\Facades\Storage::disk('public')->exists($oldPath)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
                }
            }

            $path = $request->file('audio_file')->store('audio', 'public');
            $validated['audio_url'] = '/storage/' . $path;
        }

        unset($validated['audio_file']);

        $dua->update($validated);

        return redirect()->route('admin.duas.index')->with('success', 'Dua updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        \App\Models\Dua::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Dua deleted successfully.');
    }
}
