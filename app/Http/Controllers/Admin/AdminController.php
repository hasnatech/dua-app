<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Benefits;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function profile(){
        return Inertia::render('Company/Profile');
    }

    public function settings(){
        return Inertia::render('Company/Settings');
    }
}
