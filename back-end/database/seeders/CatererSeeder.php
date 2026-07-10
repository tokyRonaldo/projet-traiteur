<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Caterer;
use App\Models\Role;

class CatererSeeder extends Seeder
{
    public function run(): void
    {
        $catererRole = Role::where('name', 'traiteur')->first();
        $catererUsers = User::whereHas('roles', fn($q) => $q->where('name', 'traiteur'))
            ->orderBy('id')
            ->get();

        $data = [
            [
                'company_name' => 'Saffron Hearth',
                'description' => 'Traiteur artisanal spécialisé dans la cuisine méditerranéenne fusion et les saveurs malgaches traditionnelles.',
                'location' => 'Antananarivo, Analamanga',
                'address' => 'Lot II M 45 Ankorondrano',
                'verified' => true,
                'rating' => 4.8,
                'website' => 'https://saffronhearth.mg',
                'contact' => '0341234567',
            ],
            [
                'company_name' => 'Spice Garden Catering',
                'description' => 'Cuisine fusion asiatique et malgache pour vos événements corporate et privés.',
                'location' => 'Antananarivo, Analamanga',
                'address' => 'Lot IVM 12 Antanimena',
                'verified' => true,
                'rating' => 4.5,
                'website' => null,
                'contact' => '0332345678',
            ],
            [
                'company_name' => 'Délices Malagasy',
                'description' => 'Spécialiste du romazava et des plats traditionnels revisités pour mariages et grandes réceptions.',
                'location' => 'Antananarivo, Analamanga',
                'address' => 'Lot III A 78 Ivandry',
                'verified' => true,
                'rating' => 4.9,
                'website' => 'https://delicesmalagasy.mg',
                'contact' => '0343456789',
            ],
            [
                'company_name' => 'Gourmet Tananarive',
                'description' => 'Traiteur haut de gamme pour événements d\'entreprise et séminaires.',
                'location' => 'Antananarivo, Analamanga',
                'address' => 'Lot II J 34 Andraharo',
                'verified' => false,
                'rating' => 0,
                'website' => null,
                'contact' => '0344567890',
            ],
            [
                'company_name' => "Saveurs de l'Île",
                'description' => 'Pâtisserie fine et buffets sucrés-salés pour tous types de célébrations.',
                'location' => 'Antananarivo, Analamanga',
                'address' => 'Lot I C 56 Faravohitra',
                'verified' => false,
                'rating' => 0,
                'website' => null,
                'contact' => '0335678901',
            ],
        ];

        foreach ($catererUsers as $index => $user) {
            // Ignore les utilisateurs supplémentaires au-delà des données prévues,
            // ou les utilisateurs ayant déjà un profil traiteur existant.
            if (!isset($data[$index])) {
                continue;
            }

            Caterer::firstOrCreate(
                ['user_id' => $user->id],
                $data[$index]
            );
        }
    }
}