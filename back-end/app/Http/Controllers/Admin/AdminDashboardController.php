<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Caterer;
use App\Models\Service;
use App\Models\EventRequest;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    // GET admin/dashboard
    public function index()
    {
        return response()->json([
            'clients_count' => User::whereHas('roles', fn($q) => $q->where('name', 'client'))->count(),
            'caterers_count' => Caterer::count(),
            'caterers_pending' => Caterer::where('verified', false)->count(),
            'services_count' => Service::count(),
            'requests_today' => EventRequest::whereDate('created_at', today())->count(),
            'bookings_this_month' => EventRequest::where('status', 'accepted')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'revenue' => Payment::where('status', 'completed')->sum('amount'),
            'new_users' => User::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ]);
    }

    // GET admin/dashboard/charts
    public function charts()
    {
        $registrations = User::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('count(*) as total')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->groupBy('month')->orderBy('month')->get();

        $bookings = EventRequest::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('count(*) as total')
            )
            ->where('status', 'accepted')
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->groupBy('month')->orderBy('month')->get();

        $revenue = Payment::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('sum(amount) as total')
            )
            ->where('status', 'completed')
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->groupBy('month')->orderBy('month')->get();

        $requestsByCategory = EventRequest::select('event_type', DB::raw('count(*) as total'))
            ->groupBy('event_type')->get();

        return response()->json([
            'registrations' => $registrations,
            'bookings' => $bookings,
            'revenue' => $revenue,
            'requests_by_category' => $requestsByCategory,
        ]);
    }
}