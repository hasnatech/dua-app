<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = \App\Models\Category::orderBy('sort_order')->get();
        return \Inertia\Inertia::render('Admin/Categories/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function create()
    {
        return \Inertia\Inertia::render('Admin/Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
            'sort_order' => 'integer'
        ]);

        \App\Models\Category::create($validated);

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function edit(string $id)
    {
        $category = \App\Models\Category::findOrFail($id);
        return \Inertia\Inertia::render('Admin/Categories/Edit', [
            'category' => $category
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = \App\Models\Category::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug,'.$id.'|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
            'sort_order' => 'integer'
        ]);

        $category->update($validated);

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        \App\Models\Category::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Category deleted successfully.');
    }
}
