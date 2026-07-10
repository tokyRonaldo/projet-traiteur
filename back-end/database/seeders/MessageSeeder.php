<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EventRequest;
use App\Models\Message;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        $requests = EventRequest::inRandomOrder()->take(10)->get();

        $clientMessages = [
            "Bonjour, j'aimerais avoir plus de détails sur votre menu.",
            "Est-il possible d'avoir des options sans gluten ?",
            "Merci pour votre proposition, je vais en discuter avec mon équipe.",
        ];

        $catererMessages = [
            "Bonjour, bien sûr ! Voici les détails demandés.",
            "Oui, nous pouvons tout à fait adapter le menu à vos besoins.",
            "N'hésitez pas si vous avez d'autres questions.",
        ];

        foreach ($requests as $request) {
            $caterer = $request->caterer;

            Message::create([
                'sender_id' => $request->client_id,
                'receiver_id' => $caterer->user_id,
                'event_request_id' => $request->id,
                'message' => $clientMessages[array_rand($clientMessages)],
                'read_status' => true,
                'created_at' => $request->created_at->addHours(1),
            ]);

            Message::create([
                'sender_id' => $caterer->user_id,
                'receiver_id' => $request->client_id,
                'event_request_id' => $request->id,
                'message' => $catererMessages[array_rand($catererMessages)],
                'read_status' => rand(0, 1) === 1,
                'created_at' => $request->created_at->addHours(3),
            ]);
        }
    }
}