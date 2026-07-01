<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Cette table contient les horaires habituels du traiteur.
     */
    public function up(): void
    {
        Schema::create('working_hours', function (Blueprint $table) {
             $table->id();

            $table->foreignId('caterer_id')
                ->constrained()
                ->cascadeOnDelete();

            // 1 = Lundi, 2 = Mardi ... 7 = Dimanche
            $table->tinyInteger('day_of_week');

            $table->boolean('is_open')->default(true);

            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();

            $table->timestamps();

            $table->unique(['caterer_id', 'day_of_week']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('working_hours');
    }
};
