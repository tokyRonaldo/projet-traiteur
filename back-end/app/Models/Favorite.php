<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = ['user_id', 'caterer_id'];

    public function caterer()
    {
        return $this->belongsTo(Caterer::class);
    }
}