// app/Http/Controllers/Caterer/CatererReviewController.php
<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class CatererReviewController extends Controller
{
    // GET caterer/reviews
    public function index(Request $request)
    {
        $caterer = $request->user()->caterer;

        $reviews = Review::where('caterer_id', $caterer->id)
            ->with('user')
            ->latest()
            ->get();

        return response()->json(['data' => $reviews]);
    }

    // POST caterer/reviews/{id}/reply
    public function reply(Request $request, $id)
    {
        $caterer = $request->user()->caterer;

        $request->validate(['content' => 'required|string|max:1000']);

        $review = Review::where('caterer_id', $caterer->id)->findOrFail($id);
        $review->update([
            'caterer_reply' => $request->content,
            'replied_at' => now(),
        ]);

        return response()->json(['message' => 'Réponse envoyée', 'review' => $review->fresh()]);
    }
}