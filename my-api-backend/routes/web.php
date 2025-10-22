<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Simple health check endpoint for deployment platforms (no session/cookies/CSRF)
Route::get('/health', function () {
    return response('OK', 200);
})->withoutMiddleware([
    \App\Http\Middleware\EncryptCookies::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    \Illuminate\Session\Middleware\StartSession::class,
    \Illuminate\View\Middleware\ShareErrorsFromSession::class,
    \App\Http\Middleware\VerifyCsrfToken::class,
]);

// Serve storage files (for PHP built-in server that doesn't follow symlinks properly)
Route::get('/storage/{path}', function ($path) {
    \Log::info('Storage route hit', ['path' => $path]);
    $filePath = storage_path('app/public/' . $path);
    \Log::info('Looking for file', ['filePath' => $filePath, 'exists' => file_exists($filePath)]);
    if (!file_exists($filePath)) {
        \Log::error('File not found', ['filePath' => $filePath]);
        abort(404, 'File not found: ' . $filePath);
    }
    return response()->file($filePath);
})->where('path', '.*');

// Serve media via Storage facade to avoid symlink issues completely
Route::get('/media/{path}', function ($path) {
    $disk = \Illuminate\Support\Facades\Storage::disk('public');
    if (!$disk->exists($path)) {
        abort(404);
    }
    // Will set appropriate headers and stream file
    return $disk->response($path);
})->where('path', '.*');

use App\Http\Controllers\API\AuthController;

// Sanctum CSRF Cookie Route - Must be in web middleware for XSRF-TOKEN cookie to be set properly
// This overrides the default Sanctum route to ensure it uses web middleware stack
Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
})->middleware('web');

// Social Login and Guest Login (session-based) -----------------------------
Route::get('/auth/{provider}/redirect', [AuthController::class, 'redirectToProvider']);
Route::get('/auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);
Route::post('/auth/guest', [AuthController::class, 'guestLogin']);

// Backwards-compatible endpoints: some OAuth flows may have registered the callback under /api/auth/...
// Keep these routes so providers that redirect to /api/auth/... don't 404.
Route::get('/api/auth/{provider}/redirect', [AuthController::class, 'redirectToProvider']);
Route::get('/api/auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);
Route::post('/api/auth/guest', [AuthController::class, 'guestLogin']);
