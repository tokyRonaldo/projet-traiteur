<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\Booking;
use App\Models\EventRequest;
use Illuminate\Http\Request;

class CatererQuoteController extends Controller
{
    // GET caterer/quotes
    public function index(Request $request)
    {
        $caterer = $request->user()->caterer;

        $query = Quote::where('caterer_id', $caterer->id)->with('eventRequest.client');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    // GET caterer/quote/show/{id}
    public function show(Request $request, $id)
    {
        $caterer = $request->user()->caterer;

        $quote = Quote::where('caterer_id', $caterer->id)
            ->with('eventRequest.client')
            ->findOrFail($id);

        return response()->json($quote);
    }

    // POST caterer/quote/store
    public function store(Request $request)
    {
        $caterer = $request->user()->caterer;

        $validated = $request->validate([
            'event_request_id' => 'required|exists:event_requests,id',
            'proposed_price' => 'required|numeric|min:0',
            'message' => 'nullable|string|max:2000',
        ]);

        // Vérifie que la demande appartient bien à ce traiteur
        $eventRequest = EventRequest::where('id', $validated['event_request_id'])
            ->where('caterer_id', $caterer->id)
            ->firstOrFail();

        $quote = Quote::create([
            ...$validated,
            'caterer_id' => $caterer->id,
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        $eventRequest->update(['status' => 'responded']);

        return response()->json([
            'message' => 'Devis envoyé avec succès',
            'quote' => $quote->load('eventRequest.client'),
        ], 201);
    }

    // PUT caterer/quote/update/{id}
    public function update(Request $request, $id)
    {
        $caterer = $request->user()->caterer;

        $quote = Quote::where('caterer_id', $caterer->id)->findOrFail($id);

        $validated = $request->validate([
            'proposed_price' => 'required|numeric|min:0',
            'message' => 'nullable|string|max:2000',
        ]);

        $quote->update($validated);

        return response()->json(['message' => 'Devis mis à jour', 'quote' => $quote->fresh()]);
    }

    // DELETE caterer/quote/delete/{id}
    public function destroy(Request $request, $id)
    {
        $caterer = $request->user()->caterer;
        $quote = Quote::where('caterer_id', $caterer->id)->findOrFail($id);
        $quote->delete();

        return response()->json(['message' => 'Devis supprimé']);
    }







    // Dans le contrôleur qui gère l'acceptation du devis par le client
    //ceci appartient au contrôleur client (pas encore construit) — je le mentionne pour la cohérence du flux.
    public function accept(Request $request, $quoteId)
    {
        $quote = Quote::with('eventRequest')->findOrFail($quoteId);
        $quote->update(['status' => 'accepted']);

        Booking::create([
            'caterer_id' => $quote->caterer_id,
            'client_id' => $quote->eventRequest->client_id,
            'event_request_id' => $quote->event_request_id,
            'quote_id' => $quote->id,
            'title' => $quote->eventRequest->event_type,
            'event_date' => $quote->eventRequest->event_date,
            'guests_number' => $quote->eventRequest->guests_number,
            'status' => 'confirmed',
        ]);

        return response()->json(['message' => 'Devis accepté, réservation créée']);
    }
}