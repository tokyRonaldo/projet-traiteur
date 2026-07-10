<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\EventRequest;
use Illuminate\Http\Request;

class CatererEventRequestController extends Controller
{
    // GET caterer/event-requests
    public function index(Request $request)
    {
        $caterer = $request->user()->caterer;

        $query = EventRequest::where('caterer_id', $caterer->id)->with('client');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    // GET caterer/event-request/show/{id}
    public function show(Request $request, $id)
    {
        $caterer = $request->user()->caterer;

        $eventRequest = EventRequest::where('caterer_id', $caterer->id)
            ->with(['client', 'quotes'])
            ->findOrFail($id);

        return response()->json($eventRequest);
    }

    // PUT caterer/event-request/status/{id}
    public function updateStatus(Request $request, $id)
    {
        $caterer = $request->user()->caterer;

        $request->validate(['status' => 'required|in:pending,responded,accepted,rejected']);

        $eventRequest = EventRequest::where('caterer_id', $caterer->id)->findOrFail($id);
        $eventRequest->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Statut mis à jour',
            'event_request' => $eventRequest->fresh(),
        ]);
    }
    
}