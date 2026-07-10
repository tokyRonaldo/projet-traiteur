<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class CatererProfileController extends Controller
{
    // GET caterer/profile
    public function show(Request $request)
    {
        $caterer = $request->user()->caterer;

        if (!$caterer) {
            return response()->json(['message' => 'Profil traiteur introuvable'], 404);
        }

        $logo = Media::where('entity_type', 'caterer')
            ->where('entity_id', $caterer->id)
            ->where('type', 'logo')
            ->first();

        $caterer->load('user');
        $caterer->logo_url = $logo?->url;

        return response()->json($caterer);
    }

    // PUT caterer/profile
    public function update(Request $request)
    {
        $caterer = $request->user()->caterer;

        if (!$caterer) {
            return response()->json(['message' => 'Profil traiteur introuvable'], 404);
        }

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'address' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'website' => 'nullable|url|max:255',
            'email' => 'required|email|unique:users,email,' . $request->user()->id,
            'contact' => 'nullable|string|max:30',
        ]);

        $caterer->update([
            'company_name' => $validated['company_name'],
            'description' => $validated['description'] ?? null,
            'address' => $validated['address'],
            'location' => $validated['location'],
            'website' => $validated['website'] ?? null,
            'contact' => $validated['contact'] ?? null,
        ]);

        $request->user()->update([
            'email' => $validated['email'],
            'name' => $validated['company_name'] ?? null,
        ]);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'caterer' => $caterer->fresh()->load('user'),
        ]);
    }

    // POST caterer/profile/logo
    public function updateLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|max:2048',
        ]);

        $caterer = $request->user()->caterer;

        // Supprime l'ancien logo (fichier + entrée media) s'il existe
        $existing = Media::where('entity_type', 'caterer')
            ->where('entity_id', $caterer->id)
            ->where('type', 'logo')
            ->first();

        if ($existing) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $existing->url));
            $existing->delete();
        }

        $path = $request->file('logo')->store('caterer-logos', 'public');
        $url = Storage::url($path);

        $media = Media::create([
            'entity_type' => 'caterer',
            'entity_id' => $caterer->id,
            'url' => $url,
            'type' => 'logo',
            'position' => 0,
        ]);

        return response()->json([
            'message' => 'Logo mis à jour avec succès',
            'logo_url' => $media->url,
        ]);
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => ['required', 'string', 'confirmed', Password::min(8)],
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect'], 422);
        }

        $user->update(['password' => Hash::make($validated['new_password'])]);
        $user->tokens()->where('id', '!=', $request->user()->currentAccessToken()->id)->delete();

        return response()->json(['message' => 'Mot de passe mis à jour avec succès']);
    }
}