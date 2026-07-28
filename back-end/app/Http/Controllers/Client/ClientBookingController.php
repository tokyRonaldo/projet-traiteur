<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class ClientBookingController extends Controller
{
    // GET client/bookings
    public function index(Request $request)
    {
        $bookings = Booking::where('client_id', $request->user()->id)
            ->with('caterer')
            ->orderBy('event_date')
            ->get();

        return response()->json(['data' => $bookings]);
    }

    // GET client/booking/show/{id}
    public function show(Request $request, $id)
    {
        $booking = Booking::where('client_id', $request->user()->id)
            ->with('caterer', 'quote')
            ->findOrFail($id);

        return response()->json($booking);
    }
}