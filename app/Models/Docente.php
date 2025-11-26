<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Docente extends Model
{
    use HasFactory;

    protected $table = 'docentes';

    protected $fillable = [
        'apellido_paterno',
        'apellido_materno',
        'nombres',
        'fecha_nacimiento',
        'sexo',
        'rfc',
        'curp',
        'email',
        'telefono',
        'nivel_ingles',
        'anio_ingreso',
        'carrera_id',
    ];

    // Relaciones
    public function niveles()
    {
        return $this->hasMany(NivelEstudio::class, 'docente_id');
    }

    public function experiencias()
    {
        return $this->hasMany(ExperienciaDocente::class);
    }

    public function carrera()
    {
        return $this->belongsTo(Carrera::class);
    }

     public function getNombreCompletoAttribute()
    {
        return trim("{$this->nombres} {$this->apellido_paterno} {$this->apellido_materno}");
    }

    public function cursosInternos()
    {
        return $this->belongsToMany(
            CursoInterno::class, 
            'curso_interno_docente', 
            'docente_id', 
            'curso_interno_id'
        );
    }

    public function evaluaciones()
    {
        return $this->hasMany(\App\Models\EvaluacionDocente::class);
    }
}
