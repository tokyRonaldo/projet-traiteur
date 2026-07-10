<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Quote;
use App\Models\Subscription;
use App\Models\Payment;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        // Paiements liés aux devis acceptés
        $acceptedQuotes = Quote::where('status', 'accepted')->with('eventRequest')->get();

        foreach ($acceptedQuotes as $quote) {
            Payment::create([
                'user_id' => $quote->eventRequest->client_id,
                'quote_id' => $quote->id,
                'amount' => $quote->proposed_price,
                'status' => rand(0, 10) > 2 ? 'completed' : 'pending', // 80% terminés
                'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                'created_at' => $quote->sent_at->addDays(rand(1, 5)),
            ]);
        }

        // Paiements liés aux abonnements
        foreach (Subscription::all() as $subscription) {
            Payment::create([
                'user_id' => $subscription->caterer->user_id,
                'subscription_id' => $subscription->id,
                'amount' => $subscription->price,
                'status' => 'completed',
                'transaction_id' => 'SUB-' . strtoupper(uniqid()),
                'created_at' => $subscription->start_date,
            ]);
        }
    }
}