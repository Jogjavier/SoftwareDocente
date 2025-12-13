<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Constancia extends Model
{
    protected $table = 'capacitaciones';
    protected $fillable = [
        'tipo_curso',
        'nombre',
        'instructor',
        'autoridad_educativa',
        'docente_id',
        'duracion_horas',
        'fecha_inicio',
        'fecha_fin',
        'tipo',
        'modalidad',
        'folio_fechaemision',
        'modulo_horas',
        'modulo_calificacion',
    ];
}
