{{-- Plain-text mail: output is intentionally unescaped, nothing here is rendered as HTML. --}}
Nov upit sa {{ parse_url(config('app.url'), PHP_URL_HOST) }}
----------------------------------------------

Ime:        {!! $inquiry['ime'] !!}
Firma:      {!! $inquiry['firma'] ?: '(nije uneto)' !!}
Kontakt:    {!! $inquiry['kontakt'] !!}
Sajt:       {!! $inquiry['sajt'] ?: '(nije uneto)' !!}
@if ($inquiry['paket'])
Paket:      {!! $inquiry['paket'] !!}
@endif

Poruka:
{!! $inquiry['poruka'] ?: '(nije uneto)' !!}

@if ($attribution)
Izvor posete:
@foreach ($attribution as $key => $value)
{{ str_pad($key.':', 14) }}{!! $value !!}
@endforeach

@endif
----------------------------------------------
Vreme: {{ $receivedAt->timezone('Europe/Belgrade')->format('d.m.Y. H:i') }}
IP:    {{ $ipAddress }}
