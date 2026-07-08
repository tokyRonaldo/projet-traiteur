<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use Illuminate\Http\Request;

class AdminQuoteController extends Controller
{
    // GET admin/quotes
    public function index(Request $request)
    {
        $query = Quote::with('eventRequest.client', 'caterer');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate(15));
    }

    // GET admin/quote/show/{id}
    public function show($id)
    {
        $quote = Quote::with('eventRequest.client', 'caterer')->findOrFail($id);
        return response()->json($quote);
    }
}