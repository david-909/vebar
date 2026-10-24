<?php

use App\Http\Controllers\GuideController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SitemapController;
use App\Http\Middleware\UseSiteRootView;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;
use Illuminate\View\Middleware\ShareErrorsFromSession;

/*
|--------------------------------------------------------------------------
| Public Site
|--------------------------------------------------------------------------
|
| Marketing pages are stateless: no session, no CSRF cookie. They set no
| cookies of their own (as the privacy policy promises) and can be cached
| by a CDN. The inquiry endpoint is protected by a honeypot, a timing
| check and per-IP rate limiting instead of a CSRF token.
|
*/

$stateless = [StartSession::class, ShareErrorsFromSession::class, PreventRequestForgery::class];

Route::middleware(UseSiteRootView::class)
    ->withoutMiddleware($stateless)
    ->group(function () {
        Route::get('/', [PageController::class, 'home'])->name('home');

        Route::get('vodic', [GuideController::class, 'index'])->name('guides.index');
        Route::get('vodic/{slug}', [GuideController::class, 'show'])
            ->where('slug', '[a-z0-9-]+')
            ->name('guides.show');

        Route::get('politika-privatnosti', [PageController::class, 'privacy'])->name('privacy');
        Route::get('hvala', [PageController::class, 'thanks'])->name('thanks');

        Route::post('upit', [InquiryController::class, 'store'])->name('inquiries.store');
    });

Route::get('sitemap.xml', SitemapController::class)
    ->withoutMiddleware($stateless)
    ->name('sitemap');

Route::permanentRedirect('index.html', '/')->withoutMiddleware($stateless);

/*
|--------------------------------------------------------------------------
| Application
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
