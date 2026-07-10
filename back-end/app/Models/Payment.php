<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
        
    protected $guarded = ['id']; 

    // app/Models/Payment.php
    public function user() { return $this->belongsTo(User::class); }
    public function quote() { return $this->belongsTo(Quote::class); }
    public function subscription() { return $this->belongsTo(Subscription::class); }
}
