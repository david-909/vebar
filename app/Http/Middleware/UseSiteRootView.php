<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

/**
 * Render public marketing pages with the "site" root view instead of the
 * application shell used by the authenticated area.
 */
class UseSiteRootView
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        Inertia::setRootView('site');

        return $next($request);
    }
}
