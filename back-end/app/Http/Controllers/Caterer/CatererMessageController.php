<?php

namespace App\Http\Controllers\Caterer;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CatererMessageController extends Controller
{
    // GET caterer/conversations (regroupe les messages par interlocuteur)
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        $partnerIds = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->get()
            ->map(fn($m) => $m->sender_id === $userId ? $m->receiver_id : $m->sender_id)
            ->unique();

        $conversations = $partnerIds->map(function ($partnerId) use ($userId) {
            $partner = User::find($partnerId);
            $lastMessage = Message::where(function ($q) use ($userId, $partnerId) {
                    $q->where('sender_id', $userId)->where('receiver_id', $partnerId);
                })
                ->orWhere(function ($q) use ($userId, $partnerId) {
                    $q->where('sender_id', $partnerId)->where('receiver_id', $userId);
                })
                ->latest()
                ->first();

            $unreadCount = Message::where('sender_id', $partnerId)
                ->where('receiver_id', $userId)
                ->where('read_status', false)
                ->count();

            return [
                'id' => $partnerId,
                'client_name' => $partner->name,
                'subject' => $lastMessage->event_request_id ? 'Demande liée' : 'Message direct',
                'last_message' => $lastMessage->message,
                'last_message_at' => $lastMessage->created_at,
                'unread_count' => $unreadCount,
                'online' => false, // à brancher avec un vrai système de présence plus tard
            ];
        })->sortByDesc('last_message_at')->values();

        return response()->json(['data' => $conversations]);
    }

    // GET caterer/conversations/{partnerId}/messages
    public function messages(Request $request, $partnerId)
    {
        $userId = $request->user()->id;

        $messages = Message::where(function ($q) use ($userId, $partnerId) {
                $q->where('sender_id', $userId)->where('receiver_id', $partnerId);
            })
            ->orWhere(function ($q) use ($userId, $partnerId) {
                $q->where('sender_id', $partnerId)->where('receiver_id', $userId);
            })
            ->orderBy('created_at')
            ->get()
            ->map(function ($m) use ($userId) {
                return [
                    'id' => $m->id,
                    'sender' => $m->sender_id === $userId ? 'caterer' : 'client',
                    'content' => $m->message,
                    'sent_at' => $m->created_at,
                    'read' => $m->read_status,
                ];
            });

        // Marque comme lus les messages reçus
        Message::where('sender_id', $partnerId)
            ->where('receiver_id', $userId)
            ->update(['read_status' => true]);

        return response()->json(['data' => $messages]);
    }

    // POST caterer/conversations/{partnerId}/messages
    public function send(Request $request, $partnerId)
    {
        $request->validate(['content' => 'required|string|max:2000']);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $partnerId,
            'message' => $request->content,
            'read_status' => false,
        ]);

        return response()->json(['message' => 'Message envoyé', 'data' => $message], 201);
    }
}