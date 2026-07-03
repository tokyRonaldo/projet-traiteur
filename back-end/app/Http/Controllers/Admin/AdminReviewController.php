<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class AdminReviewController extends Controller
{
    // GET admin/reviews
    public function index(Request $request)
    {
        $query = Review::with(['user', 'caterer']);

        if ($request->has('rating')) {
            $query->where('rating', $request->rating);
        }
        if ($request->has('search')) {
            $query->where('comment', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->latest()->paginate(15));
    }

    // PUT admin/reviews/hide/{id}
    public function hide($id)
    {
        $review = Review::findOrFail($id);
        $review->update(['is_hidden' => true]);

        return response()->json(['message' => 'Avis masqué']);
    }

    // PUT admin/reviews/show/{id}
    public function unhide($id)
    {
        $review = Review::findOrFail($id);
        $review->update(['is_hidden' => false]);

        return response()->json(['message' => 'Avis affiché']);
    }

    // DELETE admin/reviews/delete/{id}
    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json(['message' => 'Avis supprimé']);
    }
}