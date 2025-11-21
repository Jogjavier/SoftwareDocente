<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CursoInterno extends Model
{
    protected $table = 'curso_interno';

    protected $fillable = [
        'nombre',
        'instructor',
        'autoridad_educativa',
        'docentes',
        'duracion_horas',
        'fecha_inicio',
        'fecha_fin',
        'tipo',
        'modalidad',
        'folio_fechaemision',
        'modulo_horas',
        'modulo_calificacion',
    ];

    public function constancias()
    {
        return $this->hasMany(Constancia::class, 'curso_interno_id');
    }

    public function docentes()
    {
        return $this->belongsToMany(
            Docente::class, 
            'curso_interno_docente', 
            'curso_interno_id', 
            'docente_id'
        );
    }

}
