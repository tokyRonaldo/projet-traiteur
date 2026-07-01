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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users=User::with(['roles','caterer'])->get();
        $roles=Role::All();
        return response()->json([
            'users' => $users,
            'roles' => $roles
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storeAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        $role= Role::where('name','admin')->first();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        $user->roles()->attach($role->id);

        return response()->json([
            'message' => 'Nouvelle admin créer avec succès',
            'user'    => $user,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function showCaterer(string $id)
    {
        $caterer= Caterer::with('user')->get();
        return response()->json($caterer);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    public function updateRole(Request $request, int $id)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id'
        ]);

        try {
            $user = User::findOrFail($id);

            // Remplace tous les rôles par le nouveau
            $user->roles()->sync([$request->role_id]);

            return response()->json([
                'status' => 200,
                'msg' => 'Rôle mis à jour avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'msg' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        try {
            $user = User::find($id);

            if ($user) {
                $user->delete();

                return response()->json([
                    'status' => 200,
                    'msg' => "Utilisateur effacé avec succès"
                ], 200);
            } else {
                return response()->json([
                    'status' => 404,
                    'msg' => "Utilisateur non trouvé"
                ], 404);
            }

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'msg' => $e->getMessage()
            ], 500);
        }
    }
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
}
