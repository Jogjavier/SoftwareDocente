<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carrera extends Model
{
    protected $fillable = ['nombre', 'siglas'];

    public function experiencias()
    {
        return $this->hasMany(ExperienciaDocente::class);
    }
}
