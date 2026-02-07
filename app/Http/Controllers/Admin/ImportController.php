<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Dua;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ImportController extends Controller
{
    public function create()
    {
        return Inertia::render('Admin/Duas/Import');
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:json',
        ]);

        $file = $request->file('file');
        $json = json_decode(file_get_contents($file->getRealPath()), true);

        if (!$json || !is_array($json)) {
            return back()->withErrors(['file' => 'Invalid JSON format.']);
        }

        DB::beginTransaction();
        try {
            foreach ($json as $group) {
                if (!isset($group['category']) || !isset($group['duas'])) {
                    continue; 
                }

                $catData = $group['category'];
                
                // Create or update category
                $category = Category::updateOrCreate(
                    ['slug' => Str::slug($catData['title'])],
                    [
                        'name' => $catData['title'],
                        'icon' => $catData['icon'] ?? 'fa-mosque',
                        'color' => $catData['color'] ?? 'bg-emerald-600',
                        'description' => $catData['description'] ?? null,
                    ]
                );

                foreach ($group['duas'] as $index => $duaData) {
                    Dua::create([
                        'category_id' => $category->id,
                        'title' => $duaData['title'],
                        'arabic' => $duaData['arabic'] ?? '',
                        'transliteration' => $duaData['transliteration'] ?? '',
                        'translation' => $duaData['translation'] ?? '',
                        'translation_tamil' => $duaData['translation_tamil'] ?? '',
                        'when' => $duaData['when'] ?? '',
                        'reference' => $duaData['reference'] ?? '',
                        'benefits' => $duaData['benefits'] ?? '',
                        'audio_url' => $duaData['audio_url'] ?? '',
                        'sort_order' => $index + 1,
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('admin.duas.index')->with('success', 'Duas imported successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['file' => 'Import failed: ' . $e->getMessage()]);
        }
    }
}
