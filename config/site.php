<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Business Details
    |--------------------------------------------------------------------------
    |
    | Public business information used across the site: header, footer,
    | contact section, structured data (JSON-LD) and outgoing mail.
    |
    */

    'name' => 'Vebar',

    'tagline' => 'Izrada i redizajn sajtova i web prodavnica za mala i srednja preduzeća u Srbiji.',

    'locale' => 'sr-Latn-RS',

    'og_locale' => 'sr_RS',

    'email' => env('SITE_EMAIL', 'info@vebar.rs'),

    'phone' => '+381694025500',

    'phone_display' => '069 402 5500',

    'city' => 'Beograd',

    'country' => 'RS',

    'area_served' => 'Beograd i cela Srbija',

    'price_range' => '$$',

    'theme_color' => '#0A0A0B',

    'og_image' => '/og-image.png',

    'logo' => '/brand/vebar-znak-1024.png',

    /*
    |--------------------------------------------------------------------------
    | Contact Form
    |--------------------------------------------------------------------------
    |
    | Where inquiries from the contact form are delivered and how many
    | messages a single IP address may send per hour.
    |
    */

    'inquiries' => [
        'recipient' => env('INQUIRY_RECIPIENT', env('SITE_EMAIL', 'info@vebar.rs')),
        'per_hour' => (int) env('INQUIRY_LIMIT_PER_HOUR', 5),
        'min_seconds' => 3,
    ],

    /*
    |--------------------------------------------------------------------------
    | Services
    |--------------------------------------------------------------------------
    |
    | Services with their starting prices (RSD). Used for the services
    | section and the OfferCatalog in the structured data.
    |
    */

    'services' => [
        ['name' => 'Prezentacioni sajt', 'price' => 45000, 'description' => 'Osnovno predstavljanje firme na internetu: čime se bavite, šta nudite i kako vas kontaktirati.'],
        ['name' => 'Web prodavnica', 'price' => 120000, 'description' => 'Prodaja bez radnog vremena, sa korpom, plaćanjem i evidencijom porudžbina.'],
        ['name' => 'Katalog za veleprodaju', 'price' => 80000, 'description' => 'Kupac nalazi artikal po šifri ili tehničkim parametrima i šalje upit za ponudu, bez poziva i čekanja.'],
        ['name' => 'Domen, hosting i mejl', 'price' => 2500, 'unit' => 'MON', 'description' => 'Registracija .rs domena, poslovni mejl, hosting sa SSL sertifikatom i rezervne kopije.'],
    ],

];
