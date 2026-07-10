<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;
        
    protected $guarded = ['id']; 

    // app/Models/Review.php
    public function user() { return $this->belongsTo(User::class); }
    public function caterer() { return $this->belongsTo(Caterer::class); }
    public function service() { return $this->belongsTo(Service::class); }

}
