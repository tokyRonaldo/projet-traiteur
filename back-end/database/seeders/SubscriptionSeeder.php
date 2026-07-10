<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Caterer;
use App\Models\Subscription;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $verifiedCaterers = Caterer::where('verified', true)->get();
        $plans = ['basic' => 15000, 'premium' => 39000];

        foreach ($verifiedCaterers as $caterer) {
            $plan = array_rand($plans);
            Subscription::create([
                'caterer_id' => $caterer->id,
                'plan' => $plan,
                'price' => $plans[$plan],
                'start_date' => now()->subDays(rand(5, 60)),
                'end_date' => now()->addDays(rand(5, 30)),
                'status' => 'active',
            ]);
        }
    }
}