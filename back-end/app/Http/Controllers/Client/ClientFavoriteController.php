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
}