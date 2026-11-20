<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Services\Ai\ClientAssistant;
use Illuminate\Http\Request;
use App\Models\Quote;

class ClientAssistantController extends Controller
{
    public function findCaterers(Request $request, ClientAssistant $assistant)
    {
        $data = $request->validate(['text' => 'required|string|min:10|max:500']);

        try {
            return response()->json($assistant->findCaterers($data['text']));
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 503);
        }
    }

    public function compareQuotes(Request $request, ClientAssistant $assistant)
    {
        $data = $request->validate([
            'quote_ids'   => 'required|array|min:2|max:4',
            'quote_ids.*' => 'integer|distinct',
        ]);

        // Seuls les devis des demandes de CE client sont accessibles
        $quotes = Quote::with(['eventRequest', 'caterer'])
            ->whereHas('eventRequest', fn ($q) => $q->where('client_id', $request->user()->id))
            ->whereIn('id', $data['quote_ids'])
            ->get();

        if ($quotes->count() !== count($data['quote_ids'])) {
            return response()->json(['message' => 'Un ou plusieurs devis sont introuvables.'], 404);
        }

        try {
            return response()->json($assistant->compareQuotes($quotes));
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 503);
        }
    }
}