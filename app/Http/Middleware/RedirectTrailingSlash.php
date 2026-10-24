<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Permanently redirect "/path/" to "/path" so every page has exactly one URL,
 * independent of the web server. Also covers the trailing-slash URLs of the
 * previous static site (e.g. /vodic/koliko-kosta-izrada-sajta/).
 */
class RedirectTrailingSlash
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $path = $request->getPathInfo();

        if ($path !== '/' && str_ends_with($path, '/') && $request->isMethodSafe()) {
            $query = $request->getQueryString();
            $target = rtrim($path, '/').($query ? "?{$query}" : '');

            return redirect($target === '' ? '/' : $target, 301);
        }

        return $next($request);
    }
}
