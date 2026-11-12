<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Manufacture extends Model
{
    public $table = 'manufactures';

    protected $fillable = [
        'name',
    ];

    public function dealers(): BelongsToMany
    {
        return $this->belongsToMany(Dealer::class)->withTimestamps();
    }
}
