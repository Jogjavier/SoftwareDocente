<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NivelEstudio extends Model
{
    use HasFactory;

    protected $table = 'nivel_estudios';

    protected $fillable = [
        'docente_id',
        'nivel',
        'siglas',
        'nombre',
        'escuela_procedencia',
        'titulo_path',
        'cedula_path',
    ];

    public function docente()
    {
        return $this->belongsTo(Docente::class);
    }
}
