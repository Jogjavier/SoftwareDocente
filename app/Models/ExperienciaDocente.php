<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExperienciaDocente extends Model
{
    protected $table = 'experiencia_docente';

    protected $fillable = [
        'docente_id',
        'anio_ingreso',
        'carrera_id',
        'horas_nombramiento',
        'presidente_academia_inicio',
        'presidente_academia_fin',
        'perfildeseable_path',
        'perfildeseable_fecha_inicio',
        'perfildeseable_fecha_fin',
        'cuerpoacademico_grado',
        'cuerpoacademico_fecha_inicio',
        'cuerpoacademico_fecha_fin',
        'sni_anio',
        'sni_nivel',
        'investigaciones',
        'derecho_autor',
        'titulo',
        'rama',
        'tipo',
        'revista',
        'fecha_publicacion',
        'nombre_articulo',
        'link',
    ];

    public function docente()
    {
        return $this->belongsTo(Docente::class);
    }
    
    public function carrera()
    {
        return $this->belongsTo(Carrera::class);
    }
}
