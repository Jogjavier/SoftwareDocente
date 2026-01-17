<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Constancia extends Model
{
    protected $table = 'capacitaciones';
    protected $fillable = [
        'tipo_curso',
        'periodo',
        'anio',
        'nombre',
        'instructor',
        'autoridad_educativa',
        'duracion_horas',
        'fecha_inicio',
        'fecha_fin',
        'tipo',
        'modalidad',
        'folio_fechaemision',
        'modulo_horas',
        'modulo_calificacion',
    ];

    public function docentes()
    {
        return $this->belongsToMany(
            Docente::class,
            'capacitacion_docente',
            'capacitacion_id',
            'docente_id'
        );
    }

    public function constanciasEmitidas()
    {
        return $this->hasMany(Constancias::class, 'capacitacion_id');
    }
}