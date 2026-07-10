<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CatererMediaController extends Controller
{
    // GET caterer/gallery
    public function index(Request $request)
    {
        $caterer = $request->user()->caterer;

        $media = Media::where('entity_type', 'caterer')
            ->where('entity_id', $caterer->id)
            ->where('type', '!=', 'logo') // exclut le logo, géré via le profil
            ->orderBy('position')
            ->get();

        return response()->json($media);
    }

    // POST caterer/gallery/upload
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,mp4|max:10240', // 10 Mo
        ]);

        $caterer = $request->user()->caterer;
        $file = $request->file('file');
        $isVideo = str_starts_with($file->getMimeType(), 'video');

        $path = $file->store('caterer-gallery', 'public');

        $maxPosition = Media::where('entity_type', 'caterer')
            ->where('entity_id', $caterer->id)
            ->max('position') ?? 0;

        $media = Media::create([
            'entity_type' => 'caterer',
            'entity_id' => $caterer->id,
            'url' => Storage::url($path),
            'type' => $isVideo ? 'video' : 'image',
            'position' => $maxPosition + 1,
        ]);

        return response()->json(['message' => 'Média ajouté', 'media' => $media], 201);
    }

    // DELETE caterer/gallery/delete/{id}
    public function destroy(Request $request, $id)
    {
        $caterer = $request->user()->caterer;

        $media = Media::where('entity_type', 'caterer')
            ->where('entity_id', $caterer->id)
            ->findOrFail($id);

        Storage::disk('public')->delete(str_replace('/storage/', '', $media->url));
        $media->delete();

        return response()->json(['message' => 'Média supprimé']);
    }
}