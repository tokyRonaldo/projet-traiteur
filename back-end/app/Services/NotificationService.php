<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /** Événement métier → type attendu par l'interface */
    private const UI_TYPES = [
        'new_request'    => 'info',
        'quote_received' => 'info',
        'quote_accepted' => 'success',
        'quote_rejected' => 'warning',
    ];

    /** Cloche seulement */
    public static function inApp(User $user, string $event, string $title, string $content): void
    {
        Notification::create([
            'user_id' => $user->id,
            'type'    => self::UI_TYPES[$event] ?? 'info',
            'title'   => $title,
            'content' => $content,
            'is_read' => false,
        ]);
    }

    /** Cloche + email */
    public static function send(User $user, string $event, string $title, string $content, string $path): void
    {
        self::inApp($user, $event, $title, $content);

        // Un échec d'envoi ne doit jamais bloquer l'action principale
        try {
            $url  = rtrim(config('app.frontend_url'), '/') . $path;
            $html = '<p>' . e($content) . '</p><p><a href="' . e($url) . '">Voir sur la plateforme</a></p>';

            Mail::html($html, fn ($m) => $m->to($user->email)->subject($title));
        } catch (\Throwable $e) {
            Log::warning('Email de notification non envoyé', ['user_id' => $user->id, 'message' => $e->getMessage()]);
        }
    }
}