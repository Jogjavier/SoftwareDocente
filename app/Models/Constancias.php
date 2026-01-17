<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Constancias extends Model
{
   protected $table = 'constancias';

    protected $fillable = [
        'capacitacion_id',
        'folio',
        'hash',
        'nombre_beneficiario',
        'tipo',
        'fecha_emision',
    ];

    public function capacitacion()
    {
        return $this->belongsTo(Constancia::class, 'capacitacion_id');
    }
}
