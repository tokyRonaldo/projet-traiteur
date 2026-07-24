<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use App\Models\Media;
use Illuminate\Support\Facades\Storage;

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

        // Récupère l'image principale (position la plus basse) de chaque service en une seule requête
        $serviceIds = $services->pluck('id');
        $mediaByService = Media::where('entity_type', 'service')
            ->whereIn('entity_id', $serviceIds)
            ->orderBy('position')
            ->get()
            ->groupBy('entity_id');

        $services->each(function ($service) use ($mediaByService) {
            $firstMedia = $mediaByService->get($service->id)?->first();
            $service->thumbnail_url = $firstMedia?->url;
        });

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


    // GET caterer/service/{id}/media
    public function media(Request $request, $id)
    {
        $caterer = $request->user()->caterer;
        $service = Service::where('caterer_id', $caterer->id)->findOrFail($id);

        $media = Media::where('entity_type', 'service')
            ->where('entity_id', $service->id)
            ->orderBy('position')
            ->get();

        return response()->json($media);
    }

    // POST caterer/service/{id}/media
    public function uploadMedia(Request $request, $id)
    {
        $caterer = $request->user()->caterer;
        $service = Service::where('caterer_id', $caterer->id)->findOrFail($id);

        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,mp4|max:10240',
        ]);

        $file = $request->file('file');
        $isVideo = str_starts_with($file->getMimeType(), 'video');
        $path = $file->store('service-media', 'public');

        $maxPosition = Media::where('entity_type', 'service')
            ->where('entity_id', $service->id)
            ->max('position') ?? 0;

        $media = Media::create([
            'entity_type' => 'service',
            'entity_id' => $service->id,
            'url' => Storage::url($path),
            'type' => $isVideo ? 'video' : 'image',
            'position' => $maxPosition + 1,
        ]);

        return response()->json(['message' => 'Photo ajoutée au service', 'media' => $media], 201);
    }

public function deleteMedia(Request $request, $mediaId)
{
    $caterer = $request->user()->caterer;

    $media = Media::where('entity_type', 'service')->findOrFail($mediaId);

    // Vérifie que le service appartient bien au traiteur connecté
    Service::where('caterer_id', $caterer->id)->findOrFail($media->entity_id);

    Storage::disk('public')->delete(str_replace('/storage/', '', $media->url));
    $media->delete();

    return response()->json(['message' => 'Photo supprimée']);
}
}