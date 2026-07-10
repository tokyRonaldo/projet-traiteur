<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Caterer;
use App\Models\Service;
use App\Models\Media;

class MediaSeeder extends Seeder
{
    public function run(): void
    {
        $placeholderImages = [
            'https://picsum.photos/seed/catering1/800/600',
            'https://picsum.photos/seed/catering2/800/600',
            'https://picsum.photos/seed/catering3/800/600',
            'https://picsum.photos/seed/catering4/800/600',
        ];

        // Logos pour chaque traiteur
        foreach (Caterer::all() as $caterer) {
            Media::create([
                'entity_type' => 'caterer',
                'entity_id' => $caterer->id,
                'url' => 'https://picsum.photos/seed/logo' . $caterer->id . '/200/200',
                'type' => 'logo',
                'position' => 0,
            ]);

            // 3-5 photos de galerie par traiteur
            for ($i = 1; $i <= rand(3, 5); $i++) {
                Media::create([
                    'entity_type' => 'caterer',
                    'entity_id' => $caterer->id,
                    'url' => $placeholderImages[array_rand($placeholderImages)],
                    'type' => 'image',
                    'position' => $i,
                ]);
            }
        }

        // Photos pour chaque service
        foreach (Service::all() as $service) {
            Media::create([
                'entity_type' => 'service',
                'entity_id' => $service->id,
                'url' => $placeholderImages[array_rand($placeholderImages)],
                'type' => 'image',
                'position' => 0,
            ]);
        }
    }
}