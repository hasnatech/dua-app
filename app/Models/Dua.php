<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dua extends Model
{
    protected $fillable = ['category_id', 'title', 'arabic', 'transliteration', 'translation', 'translation_tamil', 'when', 'reference', 'benefits', 'audio_url', 'sort_order'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
