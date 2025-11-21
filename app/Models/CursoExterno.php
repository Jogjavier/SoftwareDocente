<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class CursoExterno extends Model
{
    protected $table = 'curso_externo';

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
    ];

    public function constancias()
    {
        return $this->hasMany(Constancia::class, 'curso_externo_id');
    }

    public function docentes()
    {
        return $this->belongsToMany(
            Docente::class, 
            'curso_externo_docente', 
            'curso_externo_id', 
            'docente_id'
        );
    }

}
