<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\User;
use App\Models\Booking;
use App\Models\EventRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


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

        $client = User::find($eventRequest->client_id);

        // URL frontend
        $urlAccepted = config('app.frontend_url')
            ."/client/quote/".$quote->id."/accept";


        $urlRejected = config('app.frontend_url')
            ."/client/quote/".$quote->id."/reject";

        $resp = Http::post(
                'http://localhost:5678/webhook-test/send-devis',
                [

                    'caterer' => [
                        'id' => $caterer->id,
                        'name' => $caterer->name,
                    ],


                    'client' => [
                        'id' => $client->id,
                        'name' => $client->name,
                        'email' => $client->email,
                    ],


                    'event_request' => [
                        'id' => $eventRequest->id,
                        'event_type' => $eventRequest->event_type,
                        'event_date' => $eventRequest->event_date,
                        'guests_number' => $eventRequest->guests_number,
                    ],


                    'quote' => [
                        'id' => $quote->id,
                        'price' => $quote->proposed_price,
                        'message' => $quote->message,
                    ],


                    'url_accepted' => $urlAccepted,

                    'url_rejected' => $urlRejected,

                ]
            );

        // 🔥 vérifier si n8n a répondu correctement
        if (!$resp->successful()) {
            return response()->json([
                'status' => 500,
                'msg' => 'Erreur webhook n8n',
                'error' => $resp->body()
            ], 500);
        }




        $eventRequest->update(['status' => 'responded']);

        return response()->json([
            'message' => 'Devis envoyé avec succès',
            'quote' => $quote->load('eventRequest.client'),
        ], 201);
    }

    // CatererQuoteController.php — méthode update()
    public function update(Request $request, $id)
    {
        $caterer = $request->user()->caterer;

        $quote = Quote::where('caterer_id', $caterer->id)->findOrFail($id);

        if ($quote->status !== 'sent') {
            return response()->json([
                'message' => 'Seuls les devis en attente de réponse peuvent être modifiés.',
            ], 422);
        }

        $validated = $request->validate([
            'proposed_price' => 'required|numeric|min:0',
            'message' => 'nullable|string|max:2000',
        ]);

        $quote->update($validated);

        return response()->json(['message' => 'Devis mis à jour', 'quote' => $quote->fresh()]);
    }

    // méthode destroy()
    public function destroy(Request $request, $id)
    {
        $caterer = $request->user()->caterer;
        $quote = Quote::where('caterer_id', $caterer->id)->findOrFail($id);

        if ($quote->status !== 'sent') {
            return response()->json([
                'message' => 'Seuls les devis en attente de réponse peuvent être retirés.',
            ], 422);
        }

        $quote->delete();

        return response()->json(['message' => 'Devis retiré']);
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
            'price' => $quote->proposed_price,
            'status' => 'confirmed',
        ]);

        return response()->json(['message' => 'Devis accepté, réservation créée']);
    }

    public function reject(Quote $quote)
{
    $quote->update([
        'status'=>'rejected',
    ]);


    return response()->json([
        'message'=>'Devis refusé'
    ]);
}
}