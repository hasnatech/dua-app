<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\SyncController;
use Illuminate\Support\Facades\Route;


// Sync API routes (for local development data sync)
Route::get('/sync/export-all', [SyncController::class, 'exportAll']);
Route::get('/sync/export/{table}', [SyncController::class, 'exportTable']);

// Public App Sync
Route::get('/public/sync', [\App\Http\Controllers\Api\PublicController::class, 'sync']);

Route::post('/login', [AuthController::class, 'login']);
Route::get('/user', [AuthController::class, 'profile'])->middleware('auth:sanctum');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
});

Route::match(['get', 'post'], '/webhooks/whatsapp', [\App\Http\Controllers\API\WhatsAppWebhookController::class, 'handle']);