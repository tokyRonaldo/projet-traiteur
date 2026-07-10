<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Notification;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $catererUsers = User::whereHas('roles', fn($q) => $q->where('name', 'traiteur'))->get();

        $templates = [
            ['title' => 'Nouvelle demande reçue', 'content' => 'Vous avez reçu une nouvelle demande de devis.', 'type' => 'info'],
            ['title' => 'Devis accepté', 'content' => 'Un client a accepté votre devis. Félicitations !', 'type' => 'success'],
            ['title' => 'Paiement en attente', 'content' => 'Un paiement est en attente de confirmation.', 'type' => 'warning'],
            ['title' => 'Nouvel avis reçu', 'content' => 'Un client a laissé un avis sur votre profil.', 'type' => 'info'],
            ['title' => 'Maintenance prévue', 'content' => 'La plateforme sera en maintenance dimanche de 2h à 4h.', 'type' => 'warning'],
        ];

        foreach ($catererUsers as $user) {
            foreach (range(1, rand(3, 6)) as $i) {
                $template = $templates[array_rand($templates)];
                Notification::create([
                    'user_id' => $user->id,
                    'title' => $template['title'],
                    'content' => $template['content'],
                    'type' => $template['type'],
                    'is_read' => rand(0, 1) === 1,
                    'created_at' => now()->subHours(rand(1, 200)),
                ]);
            }
        }
    }
}