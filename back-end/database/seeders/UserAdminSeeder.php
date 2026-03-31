<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class UserAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer le rôle admin si tu as une table roles
         $adminRole = Role::where('name', 'admin')->first();

        // Créer un utilisateur admin avec données aléatoires
        $user = User::factory()->create([
            'name' => 'tokyRonaldo',
            'email' => 'tokyronaldo98@gmail.com', // email aléatoire et unique
            'password' => Hash::make('bailti.fr'), // mot de passe défini
            // 'role' => 'admin',                   // si role dans users
            // 'role_id' => $adminRole->id,         // si relation roles
        ]);

        // Si tu as une relation many-to-many avec roles
         $user->roles()->attach($adminRole->id);
    }
}
