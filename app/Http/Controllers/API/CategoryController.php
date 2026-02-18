<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::with('duas')->get();

        return response()->json([
            'data' => $categories,
            'message' => 'Categories retrieved successfully'
        ]);
    }
}
