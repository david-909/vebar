<?php

namespace App\Mail;

use Carbon\CarbonInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InquiryReceived extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array{ime: string, firma: string|null, kontakt: string, sajt: string|null, paket: string|null, poruka: string|null}  $inquiry
     * @param  array<string, string>  $attribution
     */
    public function __construct(
        public array $inquiry,
        public array $attribution,
        public string $ipAddress,
        public CarbonInterface $receivedAt,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $contact = $this->inquiry['kontakt'];

        return new Envelope(
            replyTo: filter_var($contact, FILTER_VALIDATE_EMAIL)
                ? [new Address($contact, $this->inquiry['ime'])]
                : [],
            subject: 'Upit sa sajta — '.($this->inquiry['firma'] ?: $this->inquiry['ime']),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            text: 'mail.inquiry-received',
        );
    }
}
