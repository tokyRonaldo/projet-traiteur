<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\EventRequest;
use App\Models\Quote;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;

class CatererSearchController extends Controller
{
    // GET caterer/search?q=...
    public function search(Request $request)
    {
        $caterer = $request->user()->caterer;
        $term = trim($request->query('q', ''));

        if (strlen($term) < 2) {
            return response()->json(['data' => []]);
        }

        $results = [];

        // Demandes (par nom de client ou type d'événement)
        $requests = EventRequest::where('caterer_id', $caterer->id)
            ->where(function ($q) use ($term) {
                $q->where('event_type', 'like', "%{$term}%")
                  ->orWhereHas('client', fn($c) => $c->where('name', 'like', "%{$term}%"));
            })
            ->with('client')
            ->take(5)
            ->get()
            ->map(fn($r) => [
                'type' => 'demande',
                'label' => $r->client->name . ' — ' . $r->event_type,
                'sublabel' => $r->status,
                'url' => '/caterer/requests',
                'id' => $r->id,
            ]);

        // Devis
        $quotes = Quote::where('caterer_id', $caterer->id)
            ->whereHas('eventRequest.client', fn($c) => $c->where('name', 'like', "%{$term}%"))
            ->with('eventRequest.client')
            ->take(5)
            ->get()
            ->map(fn($q) => [
                'type' => 'devis',
                'label' => $q->eventRequest->client->name . ' — ' . number_format($q->proposed_price, 0) . ' €',
                'sublabel' => $q->status,
                'url' => '/caterer/quotes',
                'id' => $q->id,
            ]);

        // Réservations
        $bookings = Booking::where('caterer_id', $caterer->id)
            ->where(function ($b) use ($term) {
                $b->where('title', 'like', "%{$term}%")
                  ->orWhereHas('client', fn($c) => $c->where('name', 'like', "%{$term}%"));
            })
            ->with('client')
            ->take(5)
            ->get()
            ->map(fn($b) => [
                'type' => 'reservation',
                'label' => $b->client->name . ' — ' . $b->title,
                'sublabel' => $b->status,
                'url' => '/caterer/bookings',
                'id' => $b->id,
            ]);

        // Services
        $services = Service::where('caterer_id', $caterer->id)
            ->where('title', 'like', "%{$term}%")
            ->take(5)
            ->get()
            ->map(fn($s) => [
                'type' => 'service',
                'label' => $s->title,
                'sublabel' => number_format($s->price, 0) . ' € / personne',
                'url' => '/caterer/services',
                'id' => $s->id,
            ]);

        $results = collect()
            ->merge($requests)
            ->merge($quotes)
            ->merge($bookings)
            ->merge($services)
            ->values();

        return response()->json(['data' => $results]);
    }
}