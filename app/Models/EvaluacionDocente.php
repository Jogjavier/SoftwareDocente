<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluacionDocente extends Model
{
    protected $table = 'evaluacion_docente';
    protected $fillable = [
        'docente_id',
        'carrera_id',
        'dominio_asignatura',
        'semestre',
        'planificacion_curso',
        'ambiente_aprendizaje',
        'estrategias_metodos',
        'motivacion',
        'evaluacion',
        'comunicacion',
        'gestion_recurso',
        'tecnologias',
        'satisfaccion',
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
