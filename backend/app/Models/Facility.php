<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facility extends Model
{
    protected $fillable = [
        'name',
        'location',
        'category',
        'status',
    ];

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
}