<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\Review;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $completedBookings = Booking::where('status', 'completed')->get();

        $comments = [
            'Service absolument exceptionnel, tous nos invités étaient ravis !',
            'Très bonne prestation, quelques détails à améliorer sur le timing.',
            'Une équipe professionnelle et à l\'écoute, je recommande vivement.',
            'Le rapport qualité-prix est excellent, merci pour ce bel événement.',
            'Prestation correcte mais un peu chère par rapport au marché.',
        ];

        $replies = [
            'Merci beaucoup pour votre retour, ce fut un plaisir de participer à votre événement !',
            'Nous prenons note de vos remarques pour améliorer notre service.',
            null,
        ];

        foreach ($completedBookings as $booking) {
            $rating = rand(3, 5);
            $hasReply = rand(0, 1) === 1;

            Review::create([
                'user_id' => $booking->client_id,
                'caterer_id' => $booking->caterer_id,
                'rating' => $rating,
                'comment' => $comments[array_rand($comments)],
                'caterer_reply' => $hasReply ? $replies[array_rand(array_slice($replies, 0, 2))] : null,
                'replied_at' => $hasReply ? now()->subDays(rand(1, 10)) : null,
                'created_at' => $booking->event_date->addDays(rand(1, 5)),
            ]);
        }
    }
}