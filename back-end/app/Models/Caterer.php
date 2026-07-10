<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Booking;

class Caterer extends Model
{
    use HasFactory;
        
    protected $guarded = ['id']; 

// app/Models/Caterer.php
public function user() { return $this->belongsTo(User::class); }
public function services() { return $this->hasMany(Service::class); }
public function eventRequests() { return $this->hasMany(EventRequest::class); }
public function quotes() { return $this->hasMany(Quote::class); }
public function bookings() { return $this->hasMany(Booking::class); }
public function availabilities() { return $this->hasMany(Availability::class); }
public function workingHours() { return $this->hasMany(WorkingHour::class); }
public function reviews() { return $this->hasMany(Review::class); }
public function subscriptions() { return $this->hasMany(Subscription::class); }
public function pastEvents() { return $this->hasMany(PastEvent::class); }
}
