<?php

namespace App\Http\Controllers;


use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // For offline-first, we can inject data initially, 
        // and the frontend can also cache it in LocalStorage/IndexedDB
        $categories = Category::with(['duas' => function($query) {
            $query->orderBy('sort_order', 'asc');
        }])->orderBy('sort_order', 'asc')->get();

        return Inertia::render('Public/Home', [
            'initialCategories' => $categories
        ]);
    }

    public function showCategory($id)
    {
        $category = Category::with(['duas' => function($query) {
            $query->orderBy('sort_order', 'asc');
        }])->findOrFail($id);

        return Inertia::render('Public/Category/Show', [
            'category' => $category
        ]);
    }

    public function duaViewer($categoryId, $duaId = null)
    {
        // We can just render the same page structure or a specific viewer
        // For deep linking, we might want to load the specific category
        // But since it's an offline app, better to load the main app shell or pass correct props
        
        $categories = Category::with(['duas' => function($query) {
            $query->orderBy('sort_order', 'asc');
        }])->orderBy('sort_order', 'asc')->get();

        return Inertia::render('Public/DuaViewer', [
            'initialCategories' => $categories,
            'initialCategoryId' => $categoryId,
            'initialDuaId' => $duaId
        ]);
    }
}
