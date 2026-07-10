<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;
        
    protected $guarded = ['id']; 

     /**
     * Le service appartient à une catégorie.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Le service appartient à un traiteur.
     */
    public function caterer()
    {
        return $this->belongsTo(Caterer::class);
    }

}
