<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Caterer;
use App\Models\User;
use App\Models\Payment;
use App\Models\EventRequest;
use App\Models\Review;
use Illuminate\Support\Facades\DB;

class AdminStatisticsController extends Controller
{
    // GET admin/statistics
    public function index()
    {
        return response()->json([
            'active_caterers' => Caterer::where('verified', true)->count(),
            'active_clients' => User::whereHas('roles', fn($q) => $q->where('name', 'client'))
                ->where('is_banned', false)->count(),
            'revenue' => Payment::where('status', 'completed')->sum('amount'),
            'bookings' => EventRequest::where('status', 'accepted')->count(),
            'requests' => EventRequest::count(),
            'average_rating' => round(Review::avg('rating'), 2),
            'top_categories' => DB::table('services')
                ->join('categories', 'services.category_id', '=', 'categories.id')
                ->select('categories.name', DB::raw('count(*) as total'))
                ->groupBy('categories.name')
                ->orderByDesc('total')
                ->take(5)->get(),
            'top_cities' => Caterer::select('location', DB::raw('count(*) as total'))
                ->groupBy('location')
                ->orderByDesc('total')
                ->take(5)->get(),
            'top_caterers' => Caterer::withCount('eventRequests')
                ->orderByDesc('event_requests_count')
                ->take(5)
                ->get(['id', 'company_name', 'rating']),
        ]);
    }
}