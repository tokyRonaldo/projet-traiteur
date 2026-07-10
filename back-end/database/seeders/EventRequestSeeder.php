<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Caterer;
use App\Models\EventRequest;

class EventRequestSeeder extends Seeder
{
    public function run(): void
    {
        $clients = User::whereHas('roles', fn($q) => $q->where('name', 'client'))->get();
        $caterers = Caterer::where('verified', true)->get();

        $eventTypes = ['Mariage', 'Anniversaire', 'Cocktail Entreprise', 'Séminaire', 'Fête privée'];
        $statuses = ['pending', 'responded', 'accepted', 'rejected'];
        $messages = [
            'Nous recherchons un menu adapté à environ 100 invités, avec des options végétariennes.',
            'Événement corporate, besoin d\'un service professionnel et ponctuel.',
            'Anniversaire surprise, discrétion appréciée sur la livraison.',
            'Mariage traditionnel malgache, souhaitons inclure des plats typiques.',
        ];

        foreach (range(1, 20) as $i) {
            EventRequest::create([
                'client_id' => $clients->random()->id,
                'caterer_id' => $caterers->random()->id,
                'event_type' => $eventTypes[array_rand($eventTypes)],
                'event_date' => now()->addDays(rand(5, 90)),
                'guests_number' => rand(20, 200),
                'budget' => rand(15, 80) * 1000,
                'message' => $messages[array_rand($messages)],
                'status' => $statuses[array_rand($statuses)],
                'created_at' => now()->subDays(rand(0, 30)),
            ]);
        }
    }
}