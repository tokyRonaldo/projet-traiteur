<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class CatererPaymentController extends Controller
{
    // GET caterer/payments
    public function index(Request $request)
    {
        $caterer = $request->user()->caterer;

        $payments = Payment::whereHas('quote', function ($q) use ($caterer) {
                $q->where('caterer_id', $caterer->id);
            })
            ->with('user', 'quote.eventRequest')
            ->latest()
            ->get();

        return response()->json(['data' => $payments]);
    }
}