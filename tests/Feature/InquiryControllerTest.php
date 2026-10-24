<?php

use App\Mail\InquiryReceived;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();
    config()->set('site.inquiries.recipient', 'upiti@vebar.test');
});

test('a valid inquiry is mailed to the recipient with the visitor details', function () {
    $response = $this->postJson(route('inquiries.store'), [
        'ime' => 'Petar Petrović',
        'firma' => "Petrović\r\nd.o.o.",
        'kontakt' => 'petar@example.com',
        'sajt' => 'www.petrovic.rs',
        'poruka' => "Treba nam nov sajt.\nHvala.",
        'attribution' => ['utm_source' => 'google', 'gclid' => 'abc123', 'nepoznato' => 'x'],
    ]);

    $response->assertOk()->assertJson(['message' => 'Hvala. Javljamo se istog ili sledećeg radnog dana.']);

    Mail::assertSent(InquiryReceived::class, function (InquiryReceived $mail) {
        return $mail->hasTo('upiti@vebar.test')
            && $mail->hasReplyTo('petar@example.com')
            && $mail->hasSubject('Upit sa sajta — Petrović d.o.o.')
            && $mail->inquiry['poruka'] === "Treba nam nov sajt.\nHvala."
            && $mail->attribution === ['utm_source' => 'google', 'gclid' => 'abc123'];
    });
});

test('the package chosen on the landing page is mailed with the inquiry', function () {
    $this->postJson(route('inquiries.store'), [
        'ime' => 'Ana Anić',
        'kontakt' => '060 123 4567',
        'paket' => 'Biznis',
    ])->assertOk();

    Mail::assertSent(InquiryReceived::class, fn (InquiryReceived $mail) => $mail->inquiry['paket'] === 'Biznis');
});

test('an inquiry with a phone number has no reply-to address', function () {
    $this->postJson(route('inquiries.store'), ['ime' => 'Ana Anić', 'kontakt' => '060 123 4567'])->assertOk();

    Mail::assertSent(InquiryReceived::class, fn (InquiryReceived $mail) => $mail->replyTo === []
        && $mail->hasSubject('Upit sa sajta — Ana Anić'));
});

test('name and contact are required', function () {
    $response = $this->postJson(route('inquiries.store'), []);

    $response->assertUnprocessable()->assertJsonValidationErrors([
        'ime' => 'Unesite ime i prezime.',
        'kontakt' => 'Unesite telefon ili mejl adresu, da bismo mogli da vam odgovorimo.',
    ]);
    Mail::assertNothingSent();
});

test('a form submitted without javascript redirects to the thank-you page', function () {
    $response = $this->post(route('inquiries.store'), ['ime' => 'Ana Anić', 'kontakt' => '0601234567']);

    $response->assertStatus(303)->assertRedirect(route('thanks'));
    Mail::assertSent(InquiryReceived::class);
});

test('an invalid form submitted without javascript returns the visitor to the form', function () {
    $response = $this->post(route('inquiries.store'), ['ime' => '']);

    $response->assertStatus(303)->assertRedirect(route('home').'#kontakt');
    Mail::assertNothingSent();
});

test('an invalid landing page form submitted without javascript returns the visitor to the landing page', function () {
    $response = $this->post(route('inquiries.store'), ['ime' => ''], ['referer' => 'https://vebar.rs/izrada-sajta?gclid=abc']);

    $response->assertStatus(303)->assertRedirect(route('landing').'#upit');
    Mail::assertNothingSent();
});

test('a filled honeypot is silently accepted but not mailed', function () {
    $response = $this->postJson(route('inquiries.store'), [
        'ime' => 'Spam Bot',
        'kontakt' => 'bot@example.com',
        'veb_adresa' => 'https://spam.example',
    ]);

    $response->assertOk();
    Mail::assertNothingSent();
});

test('a form submitted faster than a person could is silently accepted but not mailed', function () {
    $this->freezeTime();

    $response = $this->postJson(route('inquiries.store'), [
        'ime' => 'Spam Bot',
        'kontakt' => 'bot@example.com',
        'ts' => now()->subSecond()->getTimestamp(),
    ]);

    $response->assertOk();
    Mail::assertNothingSent();
});

test('inquiries beyond the hourly limit per ip address are refused', function () {
    config()->set('site.inquiries.per_hour', 1);
    $payload = ['ime' => 'Petar Petrović', 'kontakt' => '0601234567'];

    $this->postJson(route('inquiries.store'), $payload)->assertOk();
    $response = $this->postJson(route('inquiries.store'), $payload);

    $response->assertUnprocessable()->assertJsonValidationErrors(['form']);
    Mail::assertSentCount(1);
});

test('submitting an inquiry sets no cookies', function () {
    $response = $this->postJson(route('inquiries.store'), ['ime' => 'Ana Anić', 'kontakt' => '0601234567']);

    expect($response->headers->getCookies())->toBe([]);
});
