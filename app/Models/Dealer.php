<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dealer extends Model
{
    public $table = 'dealers';

    protected $fillable = [
        'city',
        'country',
        'cars_count',
        'employees_count',
    ];

    protected $appends = [
        'name',
    ];

    public function getNameAttribute(): string
    {
        return $this->city;
    }

    public function manufactures(): BelongsToMany
    {
        return $this->belongsToMany(Manufacture::class)->withTimestamps();
    }

    public function cars(): HasMany
    {
        return $this->hasMany(Car::class);
    }
}
