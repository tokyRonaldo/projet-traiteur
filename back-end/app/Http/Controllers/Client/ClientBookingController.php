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

    // GET client/bookings/next
    public function next(Request $request)
    {
        $booking = Booking::where('client_id', $request->user()->id)
            ->where('status', 'confirmed')
            ->where('event_date', '>=', now())
            ->with('caterer')
            ->orderBy('event_date')
            ->first();
        
        if (!$booking) {
            return response()->json(null);
        }

        return response()->json([
            'id' => $booking->id,
            'title' => $booking->title,
            'event_date' => $booking->event_date,
            'caterer_name' => $booking->caterer->company_name,
            'tasks_done' => 0,
            'tasks_total' => 0,
        ]);
    }
}