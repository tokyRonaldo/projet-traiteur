// app/Http/Controllers/Admin/AdminPaymentController.php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class AdminPaymentController extends Controller
{
    // GET admin/payments
    public function index(Request $request)
    {
        $query = Payment::with('user');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('type')) {
            // ex: subscription vs quote
            if ($request->type === 'subscription') {
                $query->whereNotNull('subscription_id');
            } elseif ($request->type === 'quote') {
                $query->whereNotNull('quote_id');
            }
        }

        return response()->json($query->latest()->paginate(15));
    }

    // GET admin/payments/{id}
    public function show($id)
    {
        $payment = Payment::with(['user', 'subscription', 'quote'])->findOrFail($id);
        return response()->json($payment);
    }
}