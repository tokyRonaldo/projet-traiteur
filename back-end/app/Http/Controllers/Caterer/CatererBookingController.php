<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class CatererBookingController extends Controller
{
    // GET caterer/bookings
    public function index(Request $request)
    {
        $caterer = $request->user()->caterer;

        $query = Booking::where('caterer_id', $caterer->id)->with('client', 'quote');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    // GET caterer/booking/show/{id}
    public function show(Request $request, $id)
    {
        $caterer = $request->user()->caterer;

        $booking = Booking::where('caterer_id', $caterer->id)
            ->with('client', 'eventRequest', 'quote')
            ->findOrFail($id);

        return response()->json($booking);
    }

    // PUT caterer/booking/status/{id}
    public function updateStatus(Request $request, $id)
    {
        $caterer = $request->user()->caterer;

        $request->validate(['status' => 'required|in:confirmed,completed,cancelled']);

        $booking = Booking::where('caterer_id', $caterer->id)->findOrFail($id);
        $booking->update(['status' => $request->status]);

        return response()->json(['message' => 'Statut mis à jour', 'booking' => $booking->fresh()]);
    }
}