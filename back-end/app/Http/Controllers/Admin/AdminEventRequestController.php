<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventRequest;
use Illuminate\Http\Request;

class AdminEventRequestController extends Controller
{
    // GET admin/event-requests (lecture seule)
    public function index(Request $request)
    {
        $query = EventRequest::with(['client', 'caterer']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('search')) {
            $query->whereHas('client', fn($q) =>
                $q->where('name', 'like', '%' . $request->search . '%'));
        }

        return response()->json($query->latest()->paginate(15));
    }

    // GET admin/event-requests/{id}
    public function show($id)
    {
        $eventRequest = EventRequest::with(['client', 'caterer', 'quotes'])->findOrFail($id);
        return response()->json($eventRequest);
    }
}