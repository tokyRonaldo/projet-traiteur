<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Media;
use Illuminate\Support\Facades\Storage;

class AdminCategoryController extends Controller
{
    // GET admin/categories : même enrichissement que ci-dessus
    public function index()
    {
        $categories = Category::latest()->get();

        $images = Media::where('entity_type', 'category')
            ->whereIn('entity_id', $categories->pluck('id'))
            ->get()
            ->keyBy('entity_id');

        return response()->json($categories->map(fn ($c) => [
            'id' => $c->id,
            'name' => $c->name,
            'type' => $c->type,
            'image_url' => $images->get($c->id)?->url,
        ]));
    }

    // POST admin/category/{id}/image
    public function uploadImage(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $request->validate(['image' => 'required|image|max:2048']);

        // Une seule image par catégorie : on remplace l'ancienne
        $existing = Media::where('entity_type', 'category')->where('entity_id', $category->id)->first();
        if ($existing) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $existing->url));
            $existing->delete();
        }

        $path = $request->file('image')->store('category-images', 'public');

        $media = Media::create([
            'entity_type' => 'category',
            'entity_id' => $category->id,
            'url' => Storage::url($path),
            'type' => 'image',
            'position' => 0,
        ]);

        return response()->json(['image_url' => $media->url], 201);
    }

    // POST admin/category/store
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
        ]);

        $category = Category::create($request->only('name', 'type'));

        return response()->json([
            'message' => 'Catégorie créée',
            'category' => $category
        ], 201);
    }

    // PUT admin/category/update/{id}
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
        ]);

        $category = Category::findOrFail($id);
        $category->update($request->only('name', 'type'));

        return response()->json([
            'message' => 'Catégorie mise à jour',
            'category' => $category
        ]);
    }

    // DELETE admin/category/delete/{id} : nettoie aussi l'image
    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        $media = Media::where('entity_type', 'category')->where('entity_id', $category->id)->first();
        if ($media) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $media->url));
            $media->delete();
        }

        $category->delete();

        return response()->json(['message' => 'Catégorie supprimée']);
    }
}