<?php

namespace App\Services\Ai;

use App\Models\Booking;
use App\Models\Quote;

class CatererAssistantTools
{
    public function __construct(private $caterer) {}

    public static function declarations(): array
    {
        return [[
            'functionDeclarations' => [
                [
                    'name' => 'list_quotes',
                    'description' => "Liste les devis du traiteur, filtrables par statut.",
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'status' => ['type' => 'string', 'enum' => ['sent', 'accepted', 'rejected'],
                                'description' => 'Statut du devis (optionnel)'],
                        ],
                    ],
                ],
                [
                    'name' => 'list_bookings',
                    'description' => "Liste les réservations du traiteur. 'upcoming' = à venir, 'past' = passées.",
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'period' => ['type' => 'string', 'enum' => ['upcoming', 'past', 'all']],
                        ],
                    ],
                ],
                [
                    'name' => 'activity_summary',
                    'description' => "Résumé chiffré : devis envoyés/acceptés/refusés, pipeline en attente, taux de conversion.",
                    'parameters' => ['type' => 'object', 'properties' => new \stdClass()],
                ],
            ],
        ]];
    }

    public function run(string $name, array $args): array
    {
        return match ($name) {
            'list_quotes'      => $this->listQuotes($args['status'] ?? null),
            'list_bookings'    => $this->listBookings($args['period'] ?? 'upcoming'),
            'activity_summary' => $this->activitySummary(),
            default            => ['error' => 'Outil inconnu'],
        };
    }

    private function listQuotes(?string $status): array
    {
        $q = Quote::with('eventRequest')->where('caterer_id', $this->caterer->id);
        if ($status) $q->where('status', $status);

        return $q->latest()->limit(15)->get()->map(fn ($x) => [
            'id'         => $x->id,
            'status'     => $x->status,
            'price'      => (float) $x->proposed_price,
            'event_type' => $x->eventRequest?->event_type,
            'event_date' => $x->eventRequest?->event_date,
            'guests'     => $x->eventRequest?->guests_number,
        ])->all();
    }

    private function listBookings(string $period): array
    {
        $q = Booking::with('client:id,name')->where('caterer_id', $this->caterer->id);
        if ($period === 'upcoming') $q->whereDate('event_date', '>=', today());
        if ($period === 'past')     $q->whereDate('event_date', '<', today());

        return $q->orderBy('event_date')->limit(15)->get()->map(fn ($b) => [
            'id'           => $b->id,
            'title'        => $b->title,
            'client'       => $b->client?->name,
            'event_date'   => $b->event_date,
            'guests'       => $b->guests_number,
            'price'        => (float) $b->price,
            'status'       => $b->status,
            'deposit_paid' => (bool) $b->deposit_paid,
        ])->all();
    }

    private function activitySummary(): array
    {
        $quotes = Quote::where('caterer_id', $this->caterer->id)->get();
        $sent = $quotes->where('status', 'sent');
        $accepted = $quotes->where('status', 'accepted')->count();

        return [
            'quotes_sent'     => $sent->count(),
            'quotes_accepted' => $accepted,
            'quotes_rejected' => $quotes->where('status', 'rejected')->count(),
            'pipeline_amount' => (float) $sent->sum('proposed_price'),
            'conversion_rate' => ($sent->count() + $accepted) > 0
                ? round($accepted / ($sent->count() + $accepted) * 100) : 0,
        ];
    }
}