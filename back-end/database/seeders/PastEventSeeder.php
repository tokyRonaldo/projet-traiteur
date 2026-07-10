<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Caterer;
use App\Models\PastEvent;

class PastEventSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            ['title' => 'Mariage Rakoto & Ravao', 'guests_number' => 150],
            ['title' => 'Gala Entreprise Telma', 'guests_number' => 80],
            ['title' => 'Anniversaire 50 ans - Famille Andria', 'guests_number' => 45],
            ['title' => 'Séminaire BNI Madagascar', 'guests_number' => 60],
        ];

        foreach (Caterer::all() as $caterer) {
            foreach ($events as $event) {
                PastEvent::create([
                    'caterer_id' => $caterer->id,
                    'title' => $event['title'],
                    'description' => 'Un événement mémorable réalisé avec passion et professionnalisme.',
                    'event_date' => now()->subMonths(rand(1, 12))->subDays(rand(1, 28)),
                    'guests_number' => $event['guests_number'],
                    'is_public' => true,
                ]);
            }
        }
    }
}