<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Caterer;
use App\Models\WorkingHour;

class WorkingHourSeeder extends Seeder
{
    public function run(): void
    {
        $caterers = Caterer::all();

        foreach ($caterers as $caterer) {
            for ($day = 1; $day <= 7; $day++) {
                $isSunday = $day === 7;
                WorkingHour::create([
                    'caterer_id' => $caterer->id,
                    'day_of_week' => $day,
                    'is_open' => !$isSunday,
                    'start_time' => $isSunday ? null : '08:00',
                    'end_time' => $isSunday ? null : ($day === 6 ? '22:00' : '18:00'),
                ]);
            }
        }
    }
}