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
            'audio_url' => 'nullable|url',
            'sort_order' => 'integer'
        ]);

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
            'audio_url' => 'nullable|url',
            'sort_order' => 'integer'
        ]);

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
