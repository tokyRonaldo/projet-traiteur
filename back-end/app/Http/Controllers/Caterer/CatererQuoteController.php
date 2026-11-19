<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\User;
use App\Models\Booking;
use App\Models\EventRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB; 
use Illuminate\Support\Facades\Log; 
use App\Services\NotificationService;


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

    public function store(Request $request)
    {
        $caterer = $request->user()->caterer;

        $validated = $request->validate([
            'event_request_id' => 'required|exists:event_requests,id',
            'proposed_price' => 'required|numeric|min:0',
            'message' => 'nullable|string|max:2000',
        ]);

        $eventRequest = EventRequest::where('id', $validated['event_request_id'])
            ->where('caterer_id', $caterer->id)
            ->firstOrFail();

        // Création du devis + changement de statut de la demande : tout ou rien
        $quote = DB::transaction(function () use ($validated, $caterer, $eventRequest) {
            $quote = Quote::create([
                ...$validated,
                'caterer_id' => $caterer->id,
                'status' => 'sent',
                'sent_at' => now(),
            ]);
            $eventRequest->update(['status' => 'responded']);

            return $quote;
        });

        $client = User::find($eventRequest->client_id);
        $frontend = config('app.frontend_url');

        // Email via n8n : s'il échoue, le devis reste valide
        $emailEnvoye = false;
        try {
            $resp = Http::timeout(10)->post(config('services.n8n.send_devis_url'), [
                'caterer' => ['id' => $caterer->id, 'name' => $caterer->company_name ?? $caterer->name],
                'client' => ['id' => $client->id, 'name' => $client->name, 'email' => $client->email],
                'event_request' => [
                    'id' => $eventRequest->id,
                    'event_type' => $eventRequest->event_type,
                    'event_date' => $eventRequest->event_date,
                    'guests_number' => $eventRequest->guests_number,
                ],
                'quote' => ['id' => $quote->id, 'price' => $quote->proposed_price, 'message' => $quote->message],
                'url_accepted' => "$frontend/client/quote/{$quote->id}/accept",
                'url_rejected' => "$frontend/client/quote/{$quote->id}/reject",
            ]);
            $emailEnvoye = $resp->successful();
        } catch (\Throwable $e) {
            Log::warning('Webhook n8n injoignable', ['message' => $e->getMessage()]);
        }

        if (!$emailEnvoye) {
            Log::warning('Email du devis non envoyé via n8n', ['quote_id' => $quote->id]);
        }

        NotificationService::inApp(
            $client,
            'quote_received',
            'Nouveau devis reçu',
            ($caterer->company_name ?? 'Un traiteur') . " vous a envoyé un devis de {$quote->proposed_price} €."
        );
        
        return response()->json([
            'message' => 'Devis envoyé avec succès',
            'email_sent' => $emailEnvoye,
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