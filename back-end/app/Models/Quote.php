<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;
        
    protected $guarded = ['id']; 

    protected $casts = [
    'sent_at' => 'datetime',
];

    // app/Models/Quote.php
    public function eventRequest() { return $this->belongsTo(EventRequest::class); }
    public function caterer() { return $this->belongsTo(Caterer::class); }

}
