<?php

namespace App\Http\Middleware;

use App\Models\UserActivityLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogUserActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // if (auth()->check()) {
        //     UserActivityLog::create([
        //         'user_id' => auth()->id(),
        //         'action' => $request->route()->getName() ?? 'unknown',
        //         'description' => $request->method() . ' ' . $request->path(),
        //         'ip_address' => $request->ip(),
        //         'user_agent' => $request->userAgent(),
        //         'method' => $request->method(),
        //         'meta' => json_encode($request->all()),
        //     ]);
        // }

        return $response;
        // return $next($request);
    }
}
