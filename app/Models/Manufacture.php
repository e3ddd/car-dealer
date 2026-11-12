<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Manufacture extends Model
{
    public $table = 'manufactures';

    protected $fillable = [
        'name',
    ];

    public function dealers(): HasMany
    {
        return $this->hasMany(Dealer::class);
    }
}
