<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
        
    protected $guarded = ['id']; 

    // app/Models/Booking.php
    public function caterer() { return $this->belongsTo(Caterer::class); }
    public function client() { return $this->belongsTo(User::class, 'client_id'); }
    public function eventRequest() { return $this->belongsTo(EventRequest::class); }
    public function quote() { return $this->belongsTo(Quote::class); }

}
