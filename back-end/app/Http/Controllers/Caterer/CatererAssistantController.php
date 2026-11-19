<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Services\Ai\CatererAssistant;
use App\Models\Quote; 
use App\Models\EventRequest;
use Illuminate\Http\Request;

class CatererAssistantController extends Controller
{
    public function chat(Request $request, CatererAssistant $assistant)
    {
        $data = $request->validate([
            'messages'           => 'required|array|min:1|max:20',
            'messages.*.role'    => 'required|in:user,assistant',
            'messages.*.content' => 'required|string|max:2000',
        ]);

        $caterer = $request->user()->caterer; // adapte à ta relation

        try {
            return response()->json(['reply' => $assistant->reply($caterer, $data['messages'])]);
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 503);
        }
    }

    public function draftQuoteMessage(Request $request, CatererAssistant $assistant)
    {
        $data = $request->validate([
            'quote_id'         => 'nullable|integer',
            'event_request_id' => 'nullable|integer',
            'proposed_price'   => 'nullable|numeric|min:0',
            'tone'             => 'nullable|in:chaleureux,formel',
        ]);

        $caterer = $request->user()->caterer; // adapte à ta relation

        if (!empty($data['quote_id'])) {
            // Devis existant : on vérifie qu'il appartient bien à ce traiteur
            $quote = Quote::with('eventRequest.client:id,name')
                ->where('caterer_id', $caterer->id)
                ->findOrFail($data['quote_id']);
            $eventRequest = $quote->eventRequest;
            $price = $data['proposed_price'] ?? $quote->proposed_price;
        } elseif (!empty($data['event_request_id'])) {
            // Nouvelle demande : adapte cette ligne pour vérifier que le traiteur a le droit de la voir
            $eventRequest = EventRequest::with('client:id,name')->findOrFail($data['event_request_id']);
            $price = $data['proposed_price'] ?? null;
        } else {
            return response()->json(['message' => 'Devis ou demande manquant.'], 422);
        }

        $info = [
            'company_name'      => $caterer->company_name,
            'client_first_name' => explode(' ', trim($eventRequest->client->name ?? ''))[0] ?: null,
            'event_type'        => $eventRequest->event_type,
            'event_date'        => $eventRequest->event_date,
            'guests'            => $eventRequest->guests_number,
            'price'             => $price,
        ];

        try {
            $message = $assistant->draftQuoteMessage($info, $data['tone'] ?? 'chaleureux');
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 503);
        }

        return response()->json(['message' => $message]);
    }
}