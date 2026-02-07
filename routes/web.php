<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;


Route::get('/test', function () {
    return 'Laravel is working';
});


// Public Routes (Offline First App)
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/dua/{categoryId}', [HomeController::class, 'duaViewer'])->name('dua.viewer');

// Admin Routes
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    
    Route::get('/', function () {
        return redirect()->route('admin.categories.index');
    })->name('dashboard');

    Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class);
    Route::resource('duas', \App\Http\Controllers\Admin\DuaController::class);
});

// require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
