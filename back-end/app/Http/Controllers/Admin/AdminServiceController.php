<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class AdminServiceController extends Controller
{
    // GET admin/services
    public function index(Request $request)
    {
        $query = Service::with(['caterer', 'category']);

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->has('status')) {
            $query->where('is_active', $request->boolean('status'));
        }

        return response()->json($query->latest()->paginate(15));
    }

    // GET admin/services/{id}
    public function show($id)
    {
        $service = Service::with(['caterer', 'category', 'media'])->findOrFail($id);
        return response()->json($service);
    }

    // PUT admin/services/disable/{id}
    public function disable($id)
    {
        $service = Service::findOrFail($id);
        $service->update(['is_active' => false]);

        return response()->json(['message' => 'Service désactivé']);
    }

    // PUT admin/services/enable/{id}
    public function enable($id)
    {
        $service = Service::findOrFail($id);
        $service->update(['is_active' => true]);

        return response()->json(['message' => 'Service activé']);
    }

    // DELETE admin/services/delete/{id}
    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json(['message' => 'Service supprimé']);
    }
}