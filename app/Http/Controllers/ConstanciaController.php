<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Constancia;
use App\Models\Docente;

class ConstanciaController extends Controller
{
    public function index()
    {
        //
    }

    public function create(Request $request)
    {
        return Inertia::render('capacitaciones/Create', [
            'docentes' => Docente::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'tipo_curso' => 'required|string|max:255',
            'nombre' => 'required|string|max:255',
            'instructor' => 'required|string|max:255',
            'autoridad_educativa' => 'required|string|max:255',
            'docente_id' => 'required|exists:docentes,id',
            'duracion_horas' => 'required|integer',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date',
            'tipo' => 'required|string|max:100',
            'modalidad' => 'required|string|max:100',
            'folio_fechaemision' => 'required|string|max:100',
            'modulo_horas' => 'required|integer',
            'modulo_calificacion' => 'required|numeric|min:0|max:100',
        ]);

        Constancia::create($validatedData);

        return redirect()->route('capacitaciones.index')->with('success', 'Constancia created successfully.');
    }
}
