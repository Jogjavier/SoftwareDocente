<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NivelEstudio extends Model
{
    use HasFactory;

    protected $table = 'niveles_estudios';

    protected $fillable = [
        'docente_id',
        'nivel',   // Licenciatura, Maestría, Doctorado
        'siglas',
        'nombre',
        'cedula',
        'escuela_procedencia',
        'titulo_path',
        'cedula_path'
    ];

    public function docente()
    {
        return $this->belongsTo(Docente::class);
    }
}
