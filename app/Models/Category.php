<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{

    protected $fillable = ['name', 'slug', 'description', 'icon', 'color', 'sort_order'];

    public function duas()
    {
        return $this->hasMany(Dua::class);
    }
}
