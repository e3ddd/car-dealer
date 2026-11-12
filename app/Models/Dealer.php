<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dealer extends Model
{
    public $table = 'dealers';

    protected $fillable = [
        'city',
        'country',
        'cars_count',
        'employees_count',
        'manufacture_id',
    ];

    protected $appends = [
        'name',
    ];

    public function getNameAttribute(): string
    {
        return $this->city;
    }

    public function manufacture(): BelongsTo
    {
        return $this->belongsTo(Manufacture::class);
    }

    public function cars(): HasMany
    {
        return $this->hasMany(Car::class);
    }
}
