<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Services\Ai\ClientAssistant;
use Illuminate\Http\Request;

class ClientAssistantController extends Controller
{
    public function findCaterers(Request $request, ClientAssistant $assistant)
    {
        $data = $request->validate(['text' => 'required|string|min:10|max:500']);

        try {
            return response()->json($assistant->findCaterers($data['text']));
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 503);
        }
    }
}