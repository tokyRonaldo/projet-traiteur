<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClientQuoteController extends Controller
{
    // GET client/quotes
    public function index(Request $request)
    {
        $clientId = $request->user()->id;

        $query = Quote::whereHas('eventRequest', fn($q) => $q->where('client_id', $clientId))
            ->with(['caterer', 'eventRequest']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    // POST client/quote/{id}/accept
    public function accept(Request $request, $id)
    {
        $clientId = $request->user()->id;

        $quote = Quote::whereHas('eventRequest', fn($q) => $q->where('client_id', $clientId))
            ->with('eventRequest')
            ->findOrFail($id);

        if ($quote->status !== 'sent') {
            return response()->json(['message' => 'Ce devis ne peut plus être accepté.'], 422);
        }

        DB::transaction(function () use ($quote) {
            $quote->update(['status' => 'accepted']);

            Booking::create([
                'caterer_id' => $quote->caterer_id,
                'client_id' => $quote->eventRequest->client_id,
                'event_request_id' => $quote->event_request_id,
                'quote_id' => $quote->id,
                'title' => $quote->eventRequest->event_type,
                'event_date' => $quote->eventRequest->event_date,
                'guests_number' => $quote->eventRequest->guests_number,
                'price' => $quote->proposed_price,
                'status' => 'confirmed',
            ]);

            // Refuse automatiquement les autres devis en attente pour la même demande
            Quote::where('event_request_id', $quote->event_request_id)
                ->where('id', '!=', $quote->id)
                ->where('status', 'sent')
                ->update(['status' => 'rejected', 'rejection_reason' => 'Un autre devis a été accepté pour cet événement.']);

            $quote->eventRequest->update(['status' => 'accepted']);
        });

        return response()->json(['message' => 'Devis accepté, réservation confirmée !']);
    }

    // POST client/quote/{id}/reject
    public function reject(Request $request, $id)
    {
        $clientId = $request->user()->id;

        $quote = Quote::whereHas('eventRequest', fn($q) => $q->where('client_id', $clientId))
            ->findOrFail($id);

        if ($quote->status !== 'sent') {
            return response()->json(['message' => 'Ce devis ne peut plus être refusé.'], 422);
        }

        $request->validate(['reason' => 'nullable|string|max:255']);

        $quote->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
        ]);

        return response()->json(['message' => 'Devis refusé']);
    }
}