<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class ClientMessageController extends Controller
{
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
                ->latest()->first();

            $unreadCount = Message::where('sender_id', $partnerId)
                ->where('receiver_id', $userId)->where('read_status', false)->count();

            return [
                'id' => $partnerId,
                'client_name' => $partner->name,
                'last_message' => $lastMessage->message,
                'last_message_at' => $lastMessage->created_at,
                'unread_count' => $unreadCount,
            ];
        })->sortByDesc('last_message_at')->values();

        return response()->json(['data' => $conversations]);
    }

    public function messages(Request $request, $partnerId)
    {
        $userId = $request->user()->id;

        $messages = Message::where(function ($q) use ($userId, $partnerId) {
                $q->where('sender_id', $userId)->where('receiver_id', $partnerId);
            })
            ->orWhere(function ($q) use ($userId, $partnerId) {
                $q->where('sender_id', $partnerId)->where('receiver_id', $userId);
            })
            ->orderBy('created_at')->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'sender' => $m->sender_id === $userId ? 'me' : 'other',
                'content' => $m->message,
                'sent_at' => $m->created_at,
            ]);

        Message::where('sender_id', $partnerId)->where('receiver_id', $userId)->update(['read_status' => true]);

        return response()->json(['data' => $messages]);
    }

    public function send(Request $request, $partnerId)
    {
        $request->validate(['content' => 'required|string|max:2000']);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $partnerId,
            'message' => $request->content,
            'read_status' => false,
        ]);

        return response()->json(['data' => $message], 201);
    }


    // GET client/messages/recent
    public function recent(Request $request)
    {
        $userId = $request->user()->id;

        $messages = Message::where('receiver_id', $userId)
            ->with('sender')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'sender_name' => $m->sender->name,
                'preview' => \Illuminate\Support\Str::limit($m->message, 60),
                'sent_at' => $m->created_at,
                'is_read' => $m->read_status,
            ]);

        return response()->json(['data' => $messages]);
    }
}