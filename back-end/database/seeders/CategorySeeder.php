<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            [
                'name' => 'Traiteur',
                'type' => 'cuisine'
            ],
            [
                'name' => 'Organisation événement',
                'type' => 'evenement'
            ],
            [
                'name' => 'Photographie',
                'type' => 'evenement'
            ],
            [
                'name' => 'Animation',
                'type' => 'evenement'
            ]
        ]);

    }
}
