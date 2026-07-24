<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Booking;
use Illuminate\Http\Request;

class ClientReviewController extends Controller
{
    // GET client/reviews
    public function index(Request $request)
    {
        $reviews = Review::where('user_id', $request->user()->id)
            ->with('caterer')
            ->latest()
            ->get();

        return response()->json(['data' => $reviews]);
    }

    // GET client/reviews/pending — réservations terminées sans avis
    public function pending(Request $request)
    {
        $clientId = $request->user()->id;

        $reviewedBookingIds = Review::where('user_id', $clientId)->pluck('booking_id')->filter();

        $pending = Booking::where('client_id', $clientId)
            ->where('status', '!=', 'cancelled')
            ->where('event_date', '<', now())
            ->whereNotIn('id', $reviewedBookingIds)
            ->with('caterer')
            ->get();

        return response()->json(['data' => $pending]);
    }

    // POST client/reviews/store
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $booking = Booking::where('id', $validated['booking_id'])
            ->where('client_id', $request->user()->id)
            ->firstOrFail();

        if (Review::where('booking_id', $booking->id)->exists()) {
            return response()->json(['message' => 'Vous avez déjà laissé un avis pour cette réservation.'], 422);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'caterer_id' => $booking->caterer_id,
            'booking_id' => $booking->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        // Recalcule la note moyenne du traiteur
        $avg = Review::where('caterer_id', $booking->caterer_id)->avg('rating');
        $booking->caterer()->update(['rating' => round($avg, 1)]);

        return response()->json(['message' => 'Avis publié avec succès', 'review' => $review], 201);
    }
}