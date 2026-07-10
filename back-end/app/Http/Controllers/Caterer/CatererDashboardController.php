<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\EventRequest;
use App\Models\Quote;
use App\Models\Booking;
use App\Models\Review;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CatererDashboardController extends Controller
{
    // GET caterer/dashboard
    public function index(Request $request)
    {
        $caterer = $request->user()->caterer;

        $pendingRequests = EventRequest::where('caterer_id', $caterer->id)
            ->where('status', 'pending')
            ->count();

        $requestsToday = EventRequest::where('caterer_id', $caterer->id)
            ->whereDate('created_at', today())
            ->count();

        $bookingsThisMonth = Booking::where('caterer_id', $caterer->id)
            ->whereMonth('event_date', now()->month)
            ->whereYear('event_date', now()->year)
            ->where('status', '!=', 'cancelled')
            ->count();

        $revenue = Payment::whereHas('quote', fn($q) => $q->where('caterer_id', $caterer->id))
            ->where('status', 'completed')
            ->sum('amount');

        $revenueThisMonth = Payment::whereHas('quote', fn($q) => $q->where('caterer_id', $caterer->id))
            ->where('status', 'completed')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('amount');

        $avgRating = Review::where('caterer_id', $caterer->id)->avg('rating');
        $reviewsCount = Review::where('caterer_id', $caterer->id)->count();

        $pendingQuotes = Quote::where('caterer_id', $caterer->id)->where('status', 'sent')->count();

        return response()->json([
            'pending_requests' => $pendingRequests,
            'requests_today' => $requestsToday,
            'bookings_this_month' => $bookingsThisMonth,
            'revenue_total' => $revenue,
            'revenue_this_month' => $revenueThisMonth,
            'average_rating' => round($avgRating ?? 0, 1),
            'reviews_count' => $reviewsCount,
            'pending_quotes' => $pendingQuotes,
        ]);
    }

    // GET caterer/dashboard/upcoming
    public function upcoming(Request $request)
    {
        $caterer = $request->user()->caterer;

        $bookings = Booking::where('caterer_id', $caterer->id)
            ->where('event_date', '>=', now())
            ->where('status', 'confirmed')
            ->orderBy('event_date')
            ->take(5)
            ->get(['id', 'title', 'event_date', 'guests_number']);

        return response()->json($bookings);
    }

    // GET caterer/dashboard/revenue-chart
    public function revenueChart(Request $request)
    {
        $caterer = $request->user()->caterer;

        $data = Payment::whereHas('quote', fn($q) => $q->where('caterer_id', $caterer->id))
            ->where('status', 'completed')
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('sum(amount) as total')
            )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($data);
    }
}