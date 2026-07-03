<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Models\Caterer;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;


class UserController extends Controller
{
    public function updateStatusCaterer( Request $request,int $id)
    {
        try{
            $caterer=Caterer::where('id',$id)
            ->update(['verified'=> true]);
            $caterer = Caterer::with('user')->find($id);

            $resp = Http::post('http://localhost:5678/webhook-test/caterer-status', [
                'caterer_id' => $caterer,
                'status' => true
            ]);
            return response()->json([
                'status' => 200,
                'msg' => 'status changer avec succès'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'msg' => $e->getMessage()
            ], 500);
        }
    }


    


     // GET admin/user
    public function index(Request $request)
    {
        $query = User::with('roles');

        if ($request->has('role')) {
            $query->whereHas('roles', fn($q) => $q->where('name', $request->role));
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return response()->json($query->latest()->paginate(15));
    }

    // DELETE admin/user/delete/{id}
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé']);
    }

    // POST admin/user/update-role/{id}
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id'
        ]);

        $user = User::findOrFail($id);
        $user->roles()->sync([$request->role_id]);

        return response()->json([
            'message' => 'Rôle mis à jour',
            'user' => $user->load('roles')
        ]);
    }

    // GET admin/caterer/show/{id}
    public function showCaterer($id)
    {
        $caterer = Caterer::with(['user', 'services', 'pastEvents', 'reviews', 'media'])
            ->findOrFail($id);

        return response()->json($caterer);
    }

    // POST admin/create/admin
    public function storeAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $admin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $adminRole = \App\Models\Role::where('name', 'admin')->first();
        $admin->roles()->attach($adminRole->id);

        return response()->json([
            'message' => 'Administrateur créé',
            'user' => $admin
        ], 201);
    }

    // Bonus utile : suspendre un user (Phase 3 demande "Suspendre")
    public function suspend($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_banned' => true]);

        return response()->json(['message' => 'Utilisateur suspendu']);
    }

    public function unsuspend($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_banned' => false]);

        return response()->json(['message' => 'Utilisateur réactivé']);
    }

    // Clients uniquement (Phase 3 /admin/clients)
    public function clients(Request $request)
    {
        $query = User::whereHas('roles', fn($q) => $q->where('name', 'client'));

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->latest()->paginate(15));
    }

    // Traiteurs validés uniquement (Phase 3 /admin/caterers)
    public function caterers(Request $request)
    {
        $query = Caterer::with('user')->where('verified', true);

        if ($request->has('location')) {
            $query->where('location', $request->location);
        }
        if ($request->has('rating')) {
            $query->where('rating', '>=', $request->rating);
        }

        return response()->json($query->latest()->paginate(15));
    }
}
