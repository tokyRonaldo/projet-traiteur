<?php

namespace App\Http\Controllers;

use App\Models\Caterer;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
        // REGISTER
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        $role= Role::where('name','client')->first();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        $user->roles()->attach($role->id);

        Auth::login($user);                    // Crée la session
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Inscription réussie ! Votre compte est en attente de vérification.',
            'user'    => $user,
        ], 201);
    }

    // REGISTER
    public function registerCaterer(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email',
            'password'    => 'required|min:6',
            'location'    => 'required|string',
            'adresse'     => 'required|string',
            'description' => 'nullable|string',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $role = Role::where('name', 'traiteur')->first();
        if ($role) {
            $user->roles()->attach($role->id);
        }

        Caterer::create([
            'user_id'     => $user->id,
            'company_name'=> $request->name,
            'description' => $request->description,
            'location'    => $request->location,
            'address'     => $request->adresse,  
        ]);

        Auth::login($user);
        
        session()->regenerate();

        return response()->json([
            'message' => 'Inscription réussie ! Votre compte est en attente de vérification.',
            'user'    => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    // USER
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    // LOGOUT
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback(Request $request)
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        // chercher user
        $user = User::where('email', $googleUser->getEmail())->first();

        if (!$user) {
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'password' => bcrypt(uniqid()), // password random
            ]);
        }

        // créer token Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        /*return response()->json([
            'user' => $user,
            'token' => $token,
        ]);*/
        
        // 🔥 récupérer URL frontend depuis .env
        $frontendUrl = env('FRONTEND_URL');

        // 🔥 redirection avec token
        return redirect($frontendUrl . '/auth/success?token=' . $token);
    }
}
