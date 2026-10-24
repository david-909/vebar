<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInquiryRequest;
use App\Mail\InquiryReceived;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Throwable;

class InquiryController extends Controller
{
    /**
     * Deliver a contact form inquiry by mail.
     *
     * Responds with JSON for the JavaScript form and redirects to the
     * thank-you page when the form was submitted natively.
     */
    public function store(StoreInquiryRequest $request): JsonResponse|RedirectResponse
    {
        if ($request->isLikelySpam()) {
            return $this->sent($request);
        }

        $rateLimitKey = 'inquiry:'.$request->ip();

        if (RateLimiter::tooManyAttempts($rateLimitKey, config('site.inquiries.per_hour'))) {
            return $this->failed($request, 'Primili smo više poruka sa ove veze. Pokušajte kasnije ili pišite direktno na '.config('site.email').'.');
        }

        try {
            Mail::to(config('site.inquiries.recipient'))->send(new InquiryReceived(
                inquiry: $request->inquiry(),
                attribution: $request->attribution(),
                ipAddress: (string) $request->ip(),
                receivedAt: now(),
            ));
        } catch (Throwable $exception) {
            report($exception);

            return $this->failed($request, 'Slanje trenutno ne radi. Pišite direktno na '.config('site.email').', izvinjavamo se na neprijatnosti.');
        }

        RateLimiter::hit($rateLimitKey, 3600);

        return $this->sent($request);
    }

    private function sent(StoreInquiryRequest $request): JsonResponse|RedirectResponse
    {
        if (! $request->expectsJson()) {
            return to_route('thanks', status: 303);
        }

        return response()->json([
            'message' => 'Hvala. Javljamo se istog ili sledećeg radnog dana.',
        ]);
    }

    private function failed(StoreInquiryRequest $request, string $message): RedirectResponse
    {
        if (! $request->expectsJson()) {
            return redirect()->to(route('home').'#kontakt', 303);
        }

        throw ValidationException::withMessages(['form' => $message]);
    }
}
