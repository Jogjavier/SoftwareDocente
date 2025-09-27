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
    ];

    // Relaciones
    public function nivelesEstudios()
    {
        return $this->hasMany(NivelEstudio::class);
    }

    public function experienciasDocentes()
    {
        return $this->hasMany(ExperienciaDocente::class);
    }

    public function asesores()
    {
        return $this->hasMany(Asesor::class);
    }

    public function tutores()
    {
        return $this->hasMany(Tutor::class);
    }

    public function ponentes()
    {
        return $this->hasMany(Ponente::class);
    }

    public function instructores()
    {
        return $this->hasMany(InstructorCurso::class);
    }
}
