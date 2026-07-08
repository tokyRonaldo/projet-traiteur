<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventRequest;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    // GET admin/bookings
    public function index(Request $request)
    {
        $query = EventRequest::with('client', 'caterer')
            ->whereIn('status', ['accepted', 'cancelled', 'completed']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate(15));
    }

    // GET admin/booking/show/{id}
    public function show($id)
    {
        $booking = EventRequest::with('client', 'caterer', 'quotes')->findOrFail($id);
        return response()->json($booking);
    }
}