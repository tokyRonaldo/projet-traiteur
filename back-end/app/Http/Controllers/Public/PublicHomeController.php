<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Caterer;
use App\Models\Category;
use App\Models\Review;
use App\Models\Media;
use Illuminate\Http\Request;

class PublicHomeController extends Controller
{
    // GET /public/caterers/featured
    public function featuredCaterers()
    {
        $caterers = Caterer::where('verified', true)
            ->orderByDesc('rating')
            ->take(3)
            ->get();

        $ids = $caterers->pluck('id');
        $logos = Media::where('entity_type', 'caterer')
            ->whereIn('entity_id', $ids)
            ->where('type', 'logo')
            ->get()
            ->keyBy('entity_id');

        $data = $caterers->map(function ($c) use ($logos) {
            $avgPrice = $c->services()->where('is_active', true)->avg('price');
            return [
                'id' => $c->id,
                'company_name' => $c->company_name,
                'description' => $c->description,
                'rating' => (float) $c->rating,
                'average_price' => $avgPrice ? round($avgPrice) : null,
                'logo_url' => $logos->get($c->id)?->url,
            ];
        });

        return response()->json($data);
    }

    // GET /public/categories
    public function categories()
    {
        return response()->json(Category::orderBy('name')->get());
    }

    // GET /public/reviews/featured
    public function featuredReviews()
    {
        $reviews = Review::where('rating', 5)
            ->whereNotNull('comment')
            ->with('user', 'caterer')
            ->latest()
            ->take(3)
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->user->name,
                'caterer_name' => $r->caterer->company_name,
                'comment' => $r->comment,
            ]);

        return response()->json($reviews);
    }

    // GET /public/stats
    public function stats()
    {
        return response()->json([
            'caterers_count' => Caterer::where('verified', true)->count(),
            'average_rating' => round(Caterer::where('verified', true)->avg('rating') ?? 0, 1),
        ]);
    }

    // GET /public/caterers
public function caterers(Request $request)
{
    $query = Caterer::where('verified', true);

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

    if ($request->filled('service')) {
    $serviceTerm = $request->query('service');
    $query->whereHas('services', function ($s) use ($serviceTerm) {
        $s->where('title', 'like', "%{$serviceTerm}%")->where('is_active', true);
    });
}

    if ($request->filled('min_rating')) {
        $query->where('rating', '>=', $request->query('min_rating'));
    }

    $sort = $request->query('sort', 'rating');
    match ($sort) {
        'rating' => $query->orderByDesc('rating'),
        'newest' => $query->latest(),
        default => $query->orderByDesc('rating'),
    };

    $caterers = $query->paginate(9);

    $catererIds = collect($caterers->items())->pluck('id');
    $logos = Media::where('entity_type', 'caterer')
        ->whereIn('entity_id', $catererIds)
        ->where('type', 'logo')
        ->get()
        ->keyBy('entity_id');

    $caterers->getCollection()->transform(function ($caterer) use ($logos) {
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
        ];
    });
    
    return response()->json($caterers);
}
}