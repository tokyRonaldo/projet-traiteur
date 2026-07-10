<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Caterer;
use App\Models\Category;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $caterers = Caterer::all();
        $categories = Category::all();

        $serviceTemplates = [
            ['title' => 'Buffet Mariage Prestige', 'price' => 45000, 'event_type' => 'Mariage'],
            ['title' => 'Cocktail Entreprise Classique', 'price' => 25000, 'event_type' => 'Entreprise'],
            ['title' => 'Menu Anniversaire Complet', 'price' => 20000, 'event_type' => 'Anniversaire'],
            ['title' => 'Plateau Séminaire', 'price' => 15000, 'event_type' => 'Séminaire'],
            ['title' => 'Cocktail Dînatoire Raffiné', 'price' => 30000, 'event_type' => 'Cocktail'],
            ['title' => 'Buffet Romazava Traditionnel', 'price' => 18000, 'event_type' => 'Mariage'],
        ];

        foreach ($caterers as $caterer) {
            foreach ($serviceTemplates as $template) {
                Service::create([
                    'caterer_id' => $caterer->id,
                    'category_id' => $categories->random()->id,
                    'title' => $template['title'],
                    'description' => 'Un service raffiné préparé avec des ingrédients frais et locaux, adapté à vos besoins spécifiques.',
                    'price' => $template['price'],
                    'event_type' => $template['event_type'],
                    'is_active' => rand(0, 10) > 1, // 90% actifs
                ]);
            }
        }
    }
}