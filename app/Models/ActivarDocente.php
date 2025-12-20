<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivarDocente extends Model
{
    protected $table = 'activadocente';
    protected $fillable = [
        'docente_id',
        'carrera_id',
        'semestre',
        'anio',
        'activo',
        
    ];

    public function docente()
    {
        return $this->belongsTo(\App\Models\Docente::class);
    }

    public function carrera()
    {
        return $this->belongsTo(\App\Models\Carrera::class);
    }
}
