<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Caterer;
use App\Models\Availability;

class AvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        foreach (Caterer::all() as $caterer) {
            // Un blocage de congés dans le futur
            $start = now()->addDays(rand(10, 40));
            Availability::create([
                'caterer_id' => $caterer->id,
                'start_date' => $start,
                'end_date' => $start->copy()->addDays(rand(2, 5)),
                'is_blocked' => true,
                'reason' => 'Congés',
            ]);
        }
    }
}