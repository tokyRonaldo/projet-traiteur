<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();
        $catererRole = Role::where('name', 'traiteur')->first();
        $clientRole = Role::where('name', 'client')->first();

        // Admin
        $admin = User::create([
            'name' => 'Admin Principal',
            'email' => 'admin@saffronhearth.com',
            'password' => Hash::make('password'),
            'phone' => '0341234567',
        ]);
        $admin->roles()->attach($adminRole->id);

        // 5 Traiteurs (le "contact" public sera géré dans CatererSeeder)
        $catererNames = [
            ['name' => 'Elena Rakoto', 'email' => 'elena@saffronhearth.mg'],
            ['name' => 'Jean Andria', 'email' => 'jean@spicegarden.mg'],
            ['name' => 'Marie Razafy', 'email' => 'marie@delicesmalagasy.mg'],
            ['name' => 'Luc Rabe', 'email' => 'luc@gourmettano.mg'],
            ['name' => 'Sophie Randria', 'email' => 'sophie@saveursdelile.mg'],
        ];

        foreach ($catererNames as $data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'phone' => '034' . rand(1000000, 9999999),
            ]);
            $user->roles()->attach($catererRole->id);
        }

        // 10 Clients
        $clientNames = [
            'Hery Rasolofo', 'Nirina Andriamampionona', 'Tahina Rakotondrazaka',
            'Fara Ravalison', 'Miora Rasoanaivo', 'Tojo Andriamahefa',
            'Nomena Ratsimbazafy', 'Sitraka Razanadrakoto', 'Vola Rakotoarisoa',
            'Andry Ramanantsoa',
        ];

        foreach ($clientNames as $index => $name) {
            $user = User::create([
                'name' => $name,
                'email' => 'client' . ($index + 1) . '@example.com',
                'password' => Hash::make('password'),
                'phone' => '033' . rand(1000000, 9999999),
            ]);
            $user->roles()->attach($clientRole->id);
        }
    }
}