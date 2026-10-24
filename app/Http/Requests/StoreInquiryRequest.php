<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreInquiryRequest extends FormRequest
{
    /**
     * Campaign parameters the frontend may attach to an inquiry.
     *
     * @var list<string>
     */
    public const array ATTRIBUTION_KEYS = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'gclid', 'gbraid', 'wbraid', 'landing_page', 'referrer',
    ];

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ime' => ['required', 'string', 'min:2', 'max:120'],
            'firma' => ['nullable', 'string', 'max:160'],
            'kontakt' => ['required', 'string', 'min:5', 'max:160'],
            'sajt' => ['nullable', 'string', 'max:200'],
            'poruka' => ['nullable', 'string', 'max:4000'],
            'veb_adresa' => ['nullable', 'string'],
            'ts' => ['nullable', 'integer'],
            'attribution' => ['nullable', 'array'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ime.required' => 'Unesite ime i prezime.',
            'ime.min' => 'Unesite ime i prezime.',
            'ime.max' => 'Ime može imati najviše :max znakova.',
            'kontakt.required' => 'Unesite telefon ili mejl adresu, da bismo mogli da vam odgovorimo.',
            'kontakt.min' => 'Proverite telefon ili mejl adresu.',
            'kontakt.max' => 'Kontakt može imati najviše :max znakova.',
            'firma.max' => 'Naziv firme može imati najviše :max znakova.',
            'sajt.max' => 'Adresa sajta može imati najviše :max znakova.',
            'poruka.max' => 'Poruka može imati najviše :max znakova.',
        ];
    }

    /**
     * Honeypot filled in, or the form was submitted faster than a person could.
     */
    public function isLikelySpam(): bool
    {
        if (filled($this->input('veb_adresa'))) {
            return true;
        }

        $renderedAt = (int) $this->input('ts');

        return $renderedAt > 0 && (now()->getTimestamp() - $renderedAt) < config('site.inquiries.min_seconds');
    }

    /**
     * The validated inquiry fields, with line breaks removed from single-line inputs.
     *
     * @return array{ime: string, firma: string|null, kontakt: string, sajt: string|null, poruka: string|null}
     */
    public function inquiry(): array
    {
        $singleLine = fn (?string $value): ?string => $value === null
            ? null
            : trim((string) preg_replace('/[\r\n]+/', ' ', $value));

        return [
            'ime' => (string) $singleLine($this->validated('ime')),
            'firma' => $singleLine($this->validated('firma')),
            'kontakt' => (string) $singleLine($this->validated('kontakt')),
            'sajt' => $singleLine($this->validated('sajt')),
            'poruka' => $this->validated('poruka'),
        ];
    }

    /**
     * Known campaign parameters only, truncated. Deliberately lenient: odd
     * tracking data must never cause an inquiry to be rejected.
     *
     * @return array<string, string>
     */
    public function attribution(): array
    {
        return collect((array) $this->validated('attribution', []))
            ->only(self::ATTRIBUTION_KEYS)
            ->filter(fn (mixed $value): bool => is_string($value) && trim($value) !== '')
            ->map(fn (string $value): string => mb_substr(trim($value), 0, 500))
            ->all();
    }

    /**
     * Without JavaScript the form posts natively and there is no session to
     * flash errors into, so send the visitor back to the form instead.
     */
    protected function failedValidation(Validator $validator): void
    {
        if (! $this->expectsJson()) {
            throw new HttpResponseException(redirect()->to(route('home').'#kontakt', 303));
        }

        parent::failedValidation($validator);
    }
}
