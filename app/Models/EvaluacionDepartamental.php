<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluacionDepartamental extends Model
{
    protected $table = 'evaluacion_departamental';
    protected $fillable = [
        'docente_id',
        'carrera_id',
        'periodo',
        'anio',
        'docencia',
        'tutoria',
        'vinculacion',
        'gestion',
        'global',
        'resultado_global',
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
