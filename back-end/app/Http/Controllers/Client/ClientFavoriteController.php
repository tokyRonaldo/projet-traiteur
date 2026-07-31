<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;

class ClientFavoriteController extends Controller
{
    // POST client/favorites/toggle/{catererId}
    public function toggle(Request $request, $catererId)
    {
        $userId = $request->user()->id;

        $existing = Favorite::where('user_id', $userId)->where('caterer_id', $catererId)->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['message' => 'Retiré des favoris', 'is_favorite' => false]);
        }

        Favorite::create(['user_id' => $userId, 'caterer_id' => $catererId]);
        return response()->json(['message' => 'Ajouté aux favoris', 'is_favorite' => true]);
    }


    // GET client/favorites
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $favorites = \App\Models\Favorite::where('user_id', $userId)
            ->with('caterer')
            ->latest()
            ->get();

        $catererIds = $favorites->pluck('caterer_id');
        $logos = \App\Models\Media::where('entity_type', 'caterer')
            ->whereIn('entity_id', $catererIds)
            ->where('type', 'logo')
            ->get()
            ->keyBy('entity_id');

        $data = $favorites->map(function ($fav) use ($logos) {
            return [
                'id' => $fav->caterer->id,
                'company_name' => $fav->caterer->company_name,
                'location' => $fav->caterer->location,
                'rating' => (float) $fav->caterer->rating,
                'logo_url' => $logos->get($fav->caterer->id)?->url,
            ];
        });

        return response()->json(['data' => $data]);
    }
}