<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\EventRequest;
use Illuminate\Http\Request;

class ClientEventRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = EventRequest::where('client_id', $request->user()->id)->with('caterer', 'quotes');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    public function show(Request $request, $id)
    {
        $eventRequest = EventRequest::where('client_id', $request->user()->id)
            ->with('caterer', 'quotes')
            ->findOrFail($id);

        return response()->json($eventRequest);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'caterer_id' => 'required|exists:caterers,id',
            'event_type' => 'required|string|max:255',
            'event_date' => 'required|date|after:today',
            'guests_number' => 'required|integer|min:1',
            'budget' => 'nullable|numeric|min:0',
            'message' => 'nullable|string|max:2000',
        ]);

        $eventRequest = EventRequest::create([
            ...$validated,
            'client_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'Demande envoyée', 'event_request' => $eventRequest], 201);
    }
}