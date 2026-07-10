<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EventRequest;

class QuoteSeeder extends Seeder
{
    public function run(): void
    {
        // Génère un devis pour les demandes qui ne sont pas 'pending'
        $requests = EventRequest::where('status', '!=', 'pending')->get();

        foreach ($requests as $request) {
            $status = match ($request->status) {
                'accepted' => 'accepted',
                'rejected' => 'rejected',
                default => 'sent',
            };

            $request->quotes()->create([
                'caterer_id' => $request->caterer_id,
                'proposed_price' => $request->budget * (rand(85, 110) / 100),
                'message' => 'Voici notre proposition adaptée à vos besoins. N\'hésitez pas à nous contacter pour toute question.',
                'status' => $status,
                'sent_at' => $request->created_at->addHours(rand(2, 48)),
            ]);
        }
    }
}