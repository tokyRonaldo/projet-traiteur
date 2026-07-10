<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use App\Models\WorkingHour;
use App\Models\Booking;
use Illuminate\Http\Request;

class CatererAvailabilityController extends Controller
{
    // GET caterer/working-hours
    public function workingHours(Request $request)
    {
        $caterer = $request->user()->caterer;
        $hours = WorkingHour::where('caterer_id', $caterer->id)->orderBy('day_of_week')->get();

        return response()->json($hours);
    }

    // PUT caterer/working-hours
    public function updateWorkingHours(Request $request)
    {
        $caterer = $request->user()->caterer;

        $validated = $request->validate([
            'hours' => 'required|array',
            'hours.*.day_of_week' => 'required|integer|between:1,7',
            'hours.*.is_open' => 'required|boolean',
            'hours.*.start_time' => 'nullable|date_format:H:i',
            'hours.*.end_time' => 'nullable|date_format:H:i',
        ]);

        foreach ($validated['hours'] as $day) {
            WorkingHour::updateOrCreate(
                ['caterer_id' => $caterer->id, 'day_of_week' => $day['day_of_week']],
                $day
            );
        }

        return response()->json(['message' => 'Horaires mis à jour']);
    }

    // POST caterer/availability/block
    public function block(Request $request)
    {
        $caterer = $request->user()->caterer;

        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string|max:255',
        ]);

        $block = Availability::create([
            ...$validated,
            'caterer_id' => $caterer->id,
            'is_blocked' => true,
        ]);

        return response()->json(['message' => 'Période bloquée', 'block' => $block], 201);
    }

    // DELETE caterer/availability/unblock/{id}
    public function unblock(Request $request, $id)
    {
        $caterer = $request->user()->caterer;
        Availability::where('caterer_id', $caterer->id)->findOrFail($id)->delete();

        return response()->json(['message' => 'Blocage supprimé']);
    }

    // Dans CatererAvailabilityController.php, méthode calendar()
    public function calendar(Request $request)
    {
        $caterer = $request->user()->caterer;
        $month = $request->query('month', now()->format('Y-m'));

        $start = $month . '-01';
        $end = date('Y-m-t', strtotime($start));
        $daysInMonth = (int) date('t', strtotime($start));

        $bookings = Booking::where('caterer_id', $caterer->id)
            ->whereBetween('event_date', [$start, $end])
            ->get(['id', 'title', 'event_date', 'status']);

        $blocks = Availability::where('caterer_id', $caterer->id)
            ->where('is_blocked', true)
            ->where(function ($q) use ($start, $end) {
                $q->whereBetween('start_date', [$start, $end])
                ->orWhereBetween('end_date', [$start, $end]);
            })
            ->get();

        // Charge = jours occupés (réservations confirmées) / jours ouvrés du mois
        $bookedDays = $bookings->where('status', '!=', 'cancelled')->pluck('event_date')->unique()->count();
        $workload = $daysInMonth > 0 ? round(($bookedDays / $daysInMonth) * 100) : 0;

        return response()->json([
            'bookings' => $bookings,
            'blocks' => $blocks,
            'workload' => $workload,
        ]);
    }
}