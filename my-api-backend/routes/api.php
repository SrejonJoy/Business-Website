<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// --- Stateful Authentication Routes ---
// These routes need sessions to work. We must wrap them in the 'web' middleware.
// Note: social and guest login routes have been moved to web.php so they run under the web middleware


// --- Stateless/Token-based Routes ---
// These routes are protected by Sanctum and can be used with API tokens OR the session cookie.
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Admin-only API
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/users', [\App\Http\Controllers\API\AdminController::class, 'users']);
        Route::post('/users/{id}/role', [\App\Http\Controllers\API\AdminController::class, 'updateRole']);
    });
});