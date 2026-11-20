<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Caterer;
use App\Models\Review;
use App\Services\Ai\AdminAssistant;

class AdminAssistantController extends Controller
{
    public function checkCaterer(AdminAssistant $assistant, $id)
    {
        $caterer = Caterer::findOrFail($id);

        try {
            return response()->json($assistant->checkCaterer($caterer));
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 503);
        }
    }

    public function scanReviews(AdminAssistant $assistant)
    {
        $reviews = Review::latest()->limit(30)->get();

        try {
            return response()->json($assistant->scanReviews($reviews));
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 503);
        }
    }
}