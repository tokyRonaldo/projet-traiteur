<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Cette table représente les réservations confirmées.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
               $table->id();

                $table->foreignId('caterer_id')
                    ->constrained()
                    ->cascadeOnDelete();

                $table->foreignId('client_id')
                    ->constrained('users')
                    ->cascadeOnDelete();

                $table->foreignId('event_request_id')
                    ->nullable()
                    ->constrained()
                    ->nullOnDelete();

                $table->foreignId('quote_id')
                    ->nullable()
                    ->constrained()
                    ->nullOnDelete();

                $table->string('title');

                $table->date('event_date');

                $table->unsignedInteger('guests_number')->nullable();

                $table->enum('status', [
                    'confirmed',
                    'completed',
                    'cancelled'
                ])->default('confirmed');

                $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
