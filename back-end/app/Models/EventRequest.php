<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventRequest extends Model
{
    use HasFactory;
        
    protected $guarded = ['id']; 

    // app/Models/EventRequest.php
    public function client() { return $this->belongsTo(User::class, 'client_id'); }
    public function caterer() { return $this->belongsTo(Caterer::class); }
    public function quotes() { return $this->hasMany(Quote::class); }

}
