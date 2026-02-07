<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Masters;
use App\Models\Notification;
use App\Models\NotificationUser;
use App\Models\Pet;
use App\Models\Settings;
use App\Models\Suppliers;
use App\Models\User;
use Illuminate\Http\Request;

class SyncController extends Controller
{
    /**
     * Get all data for syncing to local environment
     */
    public function exportAll(Request $request)
    {
        // Validate sync token for security
        $token = $request->header('X-Sync-Token');
        $expectedToken = config('app.sync_token', env('SYNC_TOKEN'));
        
        if (!$expectedToken || $token !== $expectedToken) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $data = [
            'users' => User::all()->makeVisible(['password'])->toArray(),
            'customers' => Customer::all()->toArray(),
            'pets' => Pet::all()->toArray(),
            'suppliers' => Suppliers::all()->toArray(),
            'masters' => Masters::all()->toArray(),
            'settings' => Settings::all()->toArray(),
            'notifications' => Notification::all()->toArray(),
            'notification_users' => NotificationUser::all()->toArray(),
        ];

        return response()->json($data);
    }

    /**
     * Export a specific table
     */
    public function exportTable(Request $request, string $table)
    {
        // Validate sync token for security
        $token = $request->header('X-Sync-Token');
        $expectedToken = config('app.sync_token', env('SYNC_TOKEN'));
        
        if (!$expectedToken || $token !== $expectedToken) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $allowedTables = [
            'users' => User::class,
            'customers' => Customer::class,
            'pets' => Pet::class,
            'suppliers' => Suppliers::class,
            'masters' => Masters::class,
            'settings' => Settings::class,
            'notifications' => Notification::class,
            'notification_users' => NotificationUser::class,
        ];

        if (!isset($allowedTables[$table])) {
            return response()->json(['error' => 'Invalid table'], 400);
        }

        $modelClass = $allowedTables[$table];
        $query = $modelClass::query();

        // Support pagination for large tables
        if ($request->has('page')) {
            $perPage = $request->get('per_page', 100);
            $data = $query->paginate($perPage);
        } else {
            $data = $query->get();
            if ($table === 'users') {
                $data = $data->makeVisible(['password']);
            }
        }

        return response()->json($data);
    }
}
