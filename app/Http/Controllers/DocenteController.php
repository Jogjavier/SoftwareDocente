<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocenteController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

         $docentes = Docente::query()
        ->when($search, function ($query, $search) {
            $query->where('nombres', 'ILIKE', "%{$search}%");
        })
        ->orderBy('id', 'asc')
        ->get();

        return Inertia::render('docentes/Index', [
            'docentes' => $docentes,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
    public function create()
    {
        return Inertia::render('docentes/Create');
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombres' => 'required|string',
            'apellido_paterno' => 'required|string',
            'apellido_materno' => 'nullable|string',
            'fecha_nacimiento' => 'required|date',
            'sexo' => 'required|in:M,F',
            'rfc' => 'required|string|unique:docentes',
            'curp' => 'required|string|unique:docentes',
            'email' => 'required|email|unique:docentes,email',
            'telefono' => 'nullable|string',
            'nivel_ingles' => 'required|string',
        ]);

        Docente::create($data);

        return redirect()->route('docentes.index')->with('success', 'Docente creado exitosamente');

    }
    public function show($id)
    {
        $docente = Docente::findOrFail($id);

        return Inertia::render('docentes/Detalles', [
            'docente' => $docente
        ]);
    }
    public function edit(Docente $docente)
    {
        return Inertia::render('docentes/Edit', [
            'docente' => $docente
        ]);
    }
    public function update(Request $request, Docente $docente)
    {
        $data = $request->validate([
            'nombres' => 'required|string|unique:docentes,nombres,' . $docente->id,
            'apellido_paterno' => 'required|string|unique:docentes,apellido_paterno,' . $docente->id,
            'apellido_materno' => 'nullable|string|unique:docentes,apellido_materno,' . $docente->id,
            'fecha_nacimiento' => 'required|date',
            'sexo' => 'required|in:M,F',
            'rfc' => 'required|string|unique:docentes,rfc,' . $docente->id,
            'curp' => 'required|string|unique:docentes,curp,' . $docente->id,
            'email' => 'required|email|unique:docentes,email,' . $docente->id,
            'telefono' => 'nullable|string',
            'nivel_ingles' => 'required|string',
        ]);

        $docente->update($data);

        return redirect()->route('docentes.index')->with('success', 'Docente actualizado exitosamente');
    }
    public function destroy(Docente $docente)
    {
        $docente->delete();

        return redirect()->route('docentes.index')->with('success', 'Docente eliminado exitosamente');
    }
}
