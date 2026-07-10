<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class CatererServiceController extends Controller
{
    // GET caterer/services
    public function index(Request $request)
    {
        $caterer = $request->user()->caterer;

        $query = Service::where('caterer_id', $caterer->id)->with('category');

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $services = $query->latest()->get();

        return response()->json(['data' => $services]);
    }

    // GET caterer/service/show/{id}
    public function show(Request $request, $id)
    {
        $caterer = $request->user()->caterer;

        $service = Service::where('caterer_id', $caterer->id)
            ->with('category')
            ->findOrFail($id);

        return response()->json($service);
    }

    // POST caterer/service/store
    public function store(Request $request)
    {
        $caterer = $request->user()->caterer;

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'event_type' => 'required|string|max:255',
        ]);

        $service = Service::create([
            ...$validated,
            'caterer_id' => $caterer->id,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Service créé avec succès',
            'service' => $service->load('category'),
        ], 201);
    }

    // PUT caterer/service/update/{id}
    public function update(Request $request, $id)
    {
        $caterer = $request->user()->caterer;

        $service = Service::where('caterer_id', $caterer->id)->findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'event_type' => 'required|string|max:255',
        ]);

        $service->update($validated);

        return response()->json([
            'message' => 'Service mis à jour avec succès',
            'service' => $service->fresh()->load('category'),
        ]);
    }

    // PUT caterer/service/enable/{id}
    public function enable(Request $request, $id)
    {
        $caterer = $request->user()->caterer;
        $service = Service::where('caterer_id', $caterer->id)->findOrFail($id);
        $service->update(['is_active' => true]);

        return response()->json(['message' => 'Service activé']);
    }

    // PUT caterer/service/disable/{id}
    public function disable(Request $request, $id)
    {
        $caterer = $request->user()->caterer;
        $service = Service::where('caterer_id', $caterer->id)->findOrFail($id);
        $service->update(['is_active' => false]);

        return response()->json(['message' => 'Service désactivé']);
    }

    // DELETE caterer/service/delete/{id}
    public function destroy(Request $request, $id)
    {
        $caterer = $request->user()->caterer;
        $service = Service::where('caterer_id', $caterer->id)->findOrFail($id);
        $service->delete();

        return response()->json(['message' => 'Service supprimé']);
    }

    // GET caterer/categories (lecture seule, pour le formulaire)
    public function categories()
    {
        return response()->json(\App\Models\Category::orderBy('name')->get());
    }
}