<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function sync()
    {
        // Fetch all categories with their duas sorted by sort_order
        $categories = \App\Models\Category::with(['duas' => function($query) {
            $query->orderBy('sort_order', 'asc');
        }])->orderBy('sort_order', 'asc')->get();

        return response()->json([
            'categories' => $categories,
            'version' => 1
        ]);
    }
}
