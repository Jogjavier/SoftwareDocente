<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Constancia extends Model
{
    protected $table = 'constancia';

    protected $fillable = [
        'nombre_completo',
        'curp',
        'centro_adscripcion',
        'periodo_inicio',
        'periodo_fin',
        'nombre_curso',
        'modalidad',
        'horas',
        'folio',
        'fecha_emision',
        'autoridad_educativa',
        'pdf_path',
    ];

    public function cursoInterno()
    {
        return $this->belongsTo(CursoInterno::class, 'curso_interno_id');
    }
    
    public function cursoExterno()
    {
        return $this->belongsTo(CursoExterno::class, 'curso_externo_id');
    }
}
