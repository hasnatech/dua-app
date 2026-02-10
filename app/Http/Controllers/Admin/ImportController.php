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
        \Illuminate\Support\Facades\Log::info('Import started');

        $request->validate([
            'file' => 'required|file', // Removed mimes:json temporarily to debug
        ]);

        $file = $request->file('file');
        $content = file_get_contents($file->getRealPath());
        
        // Remove BOM if present
        $content = preg_replace('/^[\xEF\xBB\xBF]/', '', $content);
        
        $json = json_decode($content, true);

        if (!$json) {
            \Illuminate\Support\Facades\Log::error('JSON Decode Error: ' . json_last_error_msg());
            return back()->withErrors(['file' => 'Invalid JSON format: ' . json_last_error_msg()]);
        }

        \Illuminate\Support\Facades\Log::info('JSON decoded successfully', ['keys' => array_keys($json)]);

        // Normalize input to array of groups
        $groups = [];
        if (isset($json['duas']) && is_array($json['duas'])) {
            // Single group structure (possibly without category info)
            $group = $json;
            if (!isset($group['category'])) {
                // Infer category from filename
                $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $title = Str::title(str_replace(['_', '-'], ' ', $filename));
                $group['category'] = [
                    'title' => $title,
                    'icon' => 'fa-star', // Default icon
                    'color' => 'bg-emerald-600', // Default color
                    'description' => 'Imported from ' . $file->getClientOriginalName()
                ];
            }
            $groups[] = $group;
        } elseif (is_array($json)) {
            // Check if it's a list of groups or just list of duas (unexpected but possible)
            // Assuming strict structure for list: [ {category:..., duas:...}, ... ]
             if (isset($json[0]['duas'])) {
                 $groups = $json;
             }
        }

        if (empty($groups)) {
             \Illuminate\Support\Facades\Log::error('Structure parsing failed');
             return back()->withErrors(['file' => 'Could not parse structure. Expected { "duas": [] } or [ { "category": ..., "duas": [] } ]']);
        }

        DB::beginTransaction();
        try {
            $count = 0;
            foreach ($groups as $group) {
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
                    $count++;
                }
            }

            DB::commit();
            \Illuminate\Support\Facades\Log::info("Imported $count duas");
            return redirect()->route('admin.duas.index')->with('success', "Imported $count duas successfully.");

        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Import Exception: ' . $e->getMessage());
            return back()->withErrors(['file' => 'Import failed: ' . $e->getMessage()]);
        }
    }
}
