<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\NivelEstudio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NivelEstudioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Docente $docente)
    {
        return Inertia::render('niveles/Index', [
            'docente' => $docente,
            'niveles' => $docente->niveles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Docente $docente)
    {
         return Inertia::render('niveles/Create', [
            'docente' => $docente,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Docente $docente)
    {
       $data = $request->validate([
            'nivel' => 'required|in:Licenciatura,Maestría,Doctorado',
            'siglas' => 'nullable|string|max:50',
            'nombre' => 'nullable|string',
            'escuela_procedencia' => 'nullable|string',
            'titulo_path' => 'nullable|file|mimes:pdf,jpg,png',
            'cedula_path' => 'nullable|file|mimes:pdf,jpg,png',
        ]);

        if ($request->hasFile('titulo_path')) {
            $data['titulo_path'] = $request->file('titulo_path')->store('titulos', 'public');
        }
        if ($request->hasFile('cedula_path')) {
            $data['cedula_path'] = $request->file('cedula_path')->store('cedulas', 'public');
        }

        $docente->niveles()->create($data);

        return redirect()->route('docentes.show', $docente->id)
            ->with('success', 'Nivel de estudio agregado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Docente $docente, NivelEstudio $nivel)
    {
        return Inertia::render('niveles/Edit', [
            'docente' => $docente,
            'nivel' => $nivel,
        ]);
    }

    public function update(Request $request, Docente $docente, NivelEstudio $nivel)
    {
        $data = $request->validate([
            'nivel' => 'required|in:Licenciatura,Maestría,Doctorado',
            'siglas' => 'nullable|string|max:50',
            'nombre' => 'nullable|string',
            'escuela_procedencia' => 'nullable|string',
            'titulo_path' => 'nullable|file|mimes:pdf,jpg,png',
            'cedula_path' => 'nullable|file|mimes:pdf,jpg,png',
        ]);

        if ($request->hasFile('titulo_path')) {
            $data['titulo_path'] = $request->file('titulo_path')->store('titulos', 'public');
        }
        if ($request->hasFile('cedula_path')) {
            $data['cedula_path'] = $request->file('cedula_path')->store('cedulas', 'public');
        }

        $nivel->update($data);

        return redirect()->route('docentes.show', $docente->id)
            ->with('success', 'Nivel de estudio actualizado correctamente.');
    }

    public function destroy(Docente $docente, NivelEstudio $nivel)
    {
        $nivel->delete();

        return redirect()->route('docentes.show', $docente->id)
            ->with('success', 'Nivel de estudio eliminado correctamente.');
    }
}
