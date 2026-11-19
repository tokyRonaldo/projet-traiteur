<?php

namespace App\Services\Ai;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiClient
{
    /** Codes HTTP temporaires : on réessaie. */
    private const CODES_TEMPORAIRES = [429, 500, 503, 504];

    /** Codes pour lesquels changer de modèle ne servirait à rien. */
    private const CODES_DEFINITIFS = [400, 401, 403];

    public function generate(array $payload): array
    {
        $modeles = array_values(array_unique(array_filter([
            config('services.gemini.model'),
            config('services.gemini.model_secours'),
        ])));

        foreach ($modeles as $modele) {
            try {
                $reponse = $this->envoyer($payload, $modele);
            } catch (ConnectionException $e) {
                // Délai dépassé ou réseau coupé : on passe au modèle suivant
                Log::warning('Gemini injoignable', ['modele' => $modele, 'message' => $e->getMessage()]);
                continue;
            }

            if ($reponse->successful()) {
                return $reponse->json();
            }

            Log::error('Gemini erreur', [
                'modele' => $modele,
                'status' => $reponse->status(),
                'body'   => mb_substr($reponse->body(), 0, 600),
            ]);

            if (in_array($reponse->status(), self::CODES_DEFINITIFS, true)) {
                break; // clé invalide ou requête mal formée : inutile d'insister
            }
        }

        throw new \RuntimeException("L'assistant est momentanément indisponible. Réessayez dans un instant.");
    }

    private function envoyer(array $corps, string $modele): Response
    {
        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$modele}:generateContent";

        return Http::withHeaders(['x-goog-api-key' => config('services.gemini.key')])
            ->acceptJson()
            ->connectTimeout(10)
            ->timeout(config('services.gemini.timeout'))
            ->withOptions(['force_ip_resolve' => 'v4'])
            // 2 essais seulement, 1,5 s d'écart : un chat ne doit pas faire attendre
            ->retry(
                2,
                1500,
                fn ($e) => $e instanceof RequestException
                    && in_array($e->response->status(), self::CODES_TEMPORAIRES, true),
                false
            )
            ->post($url, $corps);
    }
}