// app/Http/Controllers/Caterer/CatererSubscriptionController.php
<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;

class CatererSubscriptionController extends Controller
{
    // GET caterer/subscription
    public function show(Request $request)
    {
        $caterer = $request->user()->caterer;

        $subscription = Subscription::where('caterer_id', $caterer->id)
            ->latest()
            ->first();

        return response()->json($subscription);
    }

    // POST caterer/subscription/subscribe
    public function subscribe(Request $request)
    {
        $caterer = $request->user()->caterer;

        $request->validate([
            'plan' => 'required|in:basic,premium',
        ]);

        $prices = ['basic' => 15, 'premium' => 39];

        $subscription = Subscription::create([
            'caterer_id' => $caterer->id,
            'plan' => $request->plan,
            'price' => $prices[$request->plan],
            'start_date' => now(),
            'end_date' => now()->addMonth(),
            'status' => 'active',
        ]);

        return response()->json(['message' => 'Abonnement activé', 'subscription' => $subscription], 201);
    }

    // PUT caterer/subscription/cancel
    public function cancel(Request $request)
    {
        $caterer = $request->user()->caterer;

        Subscription::where('caterer_id', $caterer->id)
            ->where('status', 'active')
            ->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Abonnement annulé']);
    }
}