<?php

use Illuminate\Support\Facades\Route;

// Diagnostic endpoint to check config and session
Route::get('/diagnostic', function () {
    try {
        $checks = [
            'app_key_set' => !empty(config('app.key')),
            'app_key_length' => strlen(config('app.key')),
            'app_url' => config('app.url'),
            'frontend_url' => config('app.frontend_url'),
            'session_driver' => config('session.driver'),
            'session_path' => config('session.files'),
            'session_path_exists' => file_exists(config('session.files')),
            'session_path_writable' => is_writable(config('session.files')),
            'cors_origins' => config('cors.allowed_origins'),
            'cors_patterns' => config('cors.allowed_origins_patterns'),
            'sanctum_stateful' => config('sanctum.stateful'),
            'session_secure' => config('session.secure'),
            'session_same_site' => config('session.same_site'),
            'trusted_proxies' => app(\Illuminate\Http\Middleware\TrustProxies::class)->proxies ?? '*',
        ];
        
        return response()->json($checks, 200);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
})->withoutMiddleware([
    \App\Http\Middleware\EncryptCookies::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    \Illuminate\Session\Middleware\StartSession::class,
    \Illuminate\View\Middleware\ShareErrorsFromSession::class,
    \App\Http\Middleware\VerifyCsrfToken::class,
]);

// Test CSRF cookie endpoint with error catching
Route::get('/test-csrf', function () {
    try {
        // Manually try to set a session value
        session()->put('test', 'value');
        $sessionId = session()->getId();
        $csrfToken = csrf_token();
        
        return response()->json([
            'status' => 'success',
            'session_id' => $sessionId,
            'session_test' => session('test'),
            'csrf_token' => $csrfToken,
            'cookies_sent' => request()->cookies->all(),
            'request_origin' => request()->header('origin'),
            'request_referer' => request()->header('referer'),
            'request_host' => request()->getHost(),
            'request_scheme' => request()->getScheme(),
            'is_https' => request()->secure(),
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

// Check what cookies would be set by /sanctum/csrf-cookie
Route::get('/test-xsrf-cookie', function () {
    // This endpoint mimics what /sanctum/csrf-cookie does
    $token = csrf_token();
    
    // Check if XSRF-TOKEN would be set in response
    $response = response()->json([
        'message' => 'XSRF token should be in cookies',
        'csrf_token_value' => $token,
        'session_config' => [
            'secure' => config('session.secure'),
            'same_site' => config('session.same_site'),
            'domain' => config('session.domain'),
            'path' => config('session.path'),
        ],
        'note' => 'Check Set-Cookie headers in browser dev tools'
    ]);
    
    // Manually queue XSRF-TOKEN cookie to verify it's being set
    cookie()->queue(
        'XSRF-TOKEN',
        $token,
        config('session.lifetime', 120),
        config('session.path', '/'),
        config('session.domain'),
        config('session.secure', false),
        false, // httpOnly = false (must be readable by JS)
        false, // raw
        config('session.same_site', 'lax')
    );
    
    return $response;
})->middleware('web');
