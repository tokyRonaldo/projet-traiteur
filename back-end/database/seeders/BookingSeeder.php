<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Quote;
use App\Models\Booking;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $acceptedQuotes = Quote::where('status', 'accepted')->with('eventRequest')->get();

        foreach ($acceptedQuotes as $quote) {
            $eventRequest = $quote->eventRequest;
            $isPast = $eventRequest->event_date < now();

            Booking::create([
                'caterer_id' => $quote->caterer_id,
                'client_id' => $eventRequest->client_id,
                'event_request_id' => $eventRequest->id,
                'quote_id' => $quote->id,
                'title' => $eventRequest->event_type,
                'event_date' => $eventRequest->event_date,
                'guests_number' => $eventRequest->guests_number,
                'status' => $isPast ? 'completed' : 'confirmed',
            ]);
        }
    }
}