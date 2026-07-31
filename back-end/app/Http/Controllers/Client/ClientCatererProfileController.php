<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Caterer;
use App\Models\Media;
use App\Models\Review;
use App\Models\Favorite;
use Illuminate\Http\Request;

class ClientCatererProfileController extends Controller
{
    // GET client/caterers/{id}/profile
    public function show(Request $request, $id)
    {
        $userId = $request->user()->id;

        $caterer = Caterer::where('verified', true)
            ->with(['services' => fn($q) => $q->where('is_active', true), 'services.category'])
            ->findOrFail($id);

        $logo = Media::where('entity_type', 'caterer')->where('entity_id', $id)->where('type', 'logo')->first();

        $gallery = Media::where('entity_type', 'caterer')
            ->where('entity_id', $id)
            ->where('type', '!=', 'logo')
            ->orderBy('position')
            ->get(['id', 'url', 'type']);

        // Photos par service
        $serviceIds = $caterer->services->pluck('id');
        $serviceMedia = Media::where('entity_type', 'service')
            ->whereIn('entity_id', $serviceIds)
            ->orderBy('position')
            ->get()
            ->groupBy('entity_id');

        $caterer->services->each(function ($service) use ($serviceMedia) {
            $service->thumbnail_url = $serviceMedia->get($service->id)?->first()?->url;
            $service->thumbnail_type = $serviceMedia->get($service->id)?->first()?->type;
        });

        $reviews = Review::where('caterer_id', $id)
            ->with('user')
            ->latest()
            ->take(10)
            ->get(['id', 'user_id', 'rating', 'comment', 'created_at']);

        $isFavorite = Favorite::where('user_id', $userId)->where('caterer_id', $id)->exists();

        return response()->json([
            'id' => $caterer->id,
            'company_name' => $caterer->company_name,
            'description' => $caterer->description,
            'location' => $caterer->location,
            'address' => $caterer->address,
            'website' => $caterer->website,
            'contact' => $caterer->contact,
            'rating' => (float) $caterer->rating,
            'reviews_count' => Review::where('caterer_id', $id)->count(),
            'logo_url' => $logo?->url,
            'gallery' => $gallery,
            'services' => $caterer->services,
            'reviews' => $reviews,
            'is_favorite' => $isFavorite,
        ]);
    }
}