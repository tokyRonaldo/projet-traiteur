<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Favorite;
use App\Models\Media;
use Illuminate\Http\Request;
use App\Models\Caterer;


class ClientCatererSearchController extends Controller
{
    // GET client/caterers/search
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $query = Caterer::where('verified', true)->with('user');

        if ($request->filled('q')) {
            $term = $request->query('q');
            $query->where(function ($q) use ($term) {
                $q->where('company_name', 'like', "%{$term}%")
                  ->orWhere('location', 'like', "%{$term}%");
            });
        }

        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->query('location') . '%');
        }

        if ($request->filled('category_id')) {
            $categoryId = $request->query('category_id');
            $query->whereHas('services', fn($s) => $s->where('category_id', $categoryId)->where('is_active', true));
        }

        if ($request->filled('min_rating')) {
            $query->where('rating', '>=', $request->query('min_rating'));
        }

        if ($request->filled('min_price') || $request->filled('max_price')) {
            $query->whereHas('services', function ($s) use ($request) {
                if ($request->filled('min_price')) {
                    $s->where('price', '>=', $request->query('min_price'));
                }
                if ($request->filled('max_price')) {
                    $s->where('price', '<=', $request->query('max_price'));
                }
            });
        }

        // Tri
        $sort = $request->query('sort', 'rating');
        match ($sort) {
            'rating' => $query->orderByDesc('rating'),
            'price_asc' => $query->withMin('services', 'price')->orderBy('services_min_price'),
            'newest' => $query->latest(),
            default => $query->orderByDesc('rating'),
        };

        $caterers = $query->paginate(10);

        $catererIds = collect($caterers->items())->pluck('id');

        // Logos en une seule requête
        $logos = Media::where('entity_type', 'caterer')
            ->whereIn('entity_id', $catererIds)
            ->where('type', 'logo')
            ->get()
            ->keyBy('entity_id');

        // Favoris de l'utilisateur en une seule requête
        $favoriteIds = Favorite::where('user_id', $userId)
            ->whereIn('caterer_id', $catererIds)
            ->pluck('caterer_id')
            ->toArray();

        $caterers->getCollection()->transform(function ($caterer) use ($logos, $favoriteIds) {
            $activeServices = $caterer->services()->where('is_active', true)->get();
            $avgPrice = $activeServices->avg('price');
            $categoryNames = $activeServices->pluck('category.name')->filter()->unique()->take(2)->values();

            return [
                'id' => $caterer->id,
                'company_name' => $caterer->company_name,
                'description' => $caterer->description,
                'location' => $caterer->location,
                'rating' => (float) $caterer->rating,
                'average_price' => $avgPrice ? round($avgPrice) : null,
                'logo_url' => $logos->get($caterer->id)?->url,
                'tags' => $categoryNames,
                'is_favorite' => in_array($caterer->id, $favoriteIds),
            ];
        });

        return response()->json($caterers);
    }

    // GET client/categories (pour peupler le filtre)
    public function categories()
    {
        return response()->json(Category::orderBy('name')->get());
    }

    public function show(Request $request, $id)
    {
        $caterer = Caterer::where('verified', true)->findOrFail($id);

        $logo = Media::where('entity_type', 'caterer')
            ->where('entity_id', $caterer->id)
            ->where('type', 'logo')
            ->first();

        return response()->json([
            'id' => $caterer->id,
            'company_name' => $caterer->company_name,
            'location' => $caterer->location,
            'logo_url' => $logo?->url,
        ]);
    }
}