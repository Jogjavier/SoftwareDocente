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
        $docenteData = $request->validate([
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

    // Crear el docente
    $docente = Docente::create($docenteData);

    // Guardar niveles si existen - SIN validación estricta
    if ($request->has('niveles') && is_array($request->niveles)) {
        foreach ($request->niveles as $nivelData) {
            $nivel = [
                'nivel' => $nivelData['nivel'] ?? null,
                'siglas' => $nivelData['siglas'] ?? null,
                'nombre' => $nivelData['nombre'] ?? null,
                'escuela_procedencia' => $nivelData['escuela_procedencia'] ?? null,
            ];

            // Manejar archivos - verificar si es un archivo válido
            if (isset($nivelData['titulo_path']) && $nivelData['titulo_path'] instanceof \Illuminate\Http\UploadedFile) {
                $nivel['titulo_path'] = $nivelData['titulo_path']->store('titulos', 'public');
            }
            
            if (isset($nivelData['cedula_path']) && $nivelData['cedula_path'] instanceof \Illuminate\Http\UploadedFile) {
                $nivel['cedula_path'] = $nivelData['cedula_path']->store('cedulas', 'public');
            }

            // Solo crear el nivel si tiene al menos el campo 'nivel'
            if (!empty($nivel['nivel'])) {
                $docente->niveles()->create($nivel);
            }
        }
    }

    return redirect()->route('docentes.index')->with('success', 'Docente creado exitosamente');

    }
    
    public function show($id)
    {
        $docente = Docente::with('niveles')->findOrFail($id);

        return Inertia::render('docentes/Detalles', [
            'docente' => $docente
        ]);
    }
    public function edit(Docente $docente)
    {
        $docente->load('niveles');

        return Inertia::render('docentes/Edit', [
            'docente' => $docente
        ]);
    }
    public function update(Request $request, Docente $docente)
    {
        $data = $request->validate([
        'nombres' => 'required|string',
        'apellido_paterno' => 'required|string',
        'apellido_materno' => 'nullable|string',
        'fecha_nacimiento' => 'required|date',
        'sexo' => 'required|in:M,F',
        'rfc' => 'required|string|unique:docentes,rfc,' . $docente->id,
        'curp' => 'required|string|unique:docentes,curp,' . $docente->id,
        'email' => 'required|email|unique:docentes,email,' . $docente->id,
        'telefono' => 'nullable|string',
        'nivel_ingles' => 'required|string',
        'niveles' => 'array',
        ]);

        $docente->update($data);

        // ✅ Actualizar niveles existentes y crear nuevos
        if ($request->has('niveles')) {
            foreach ($request->niveles as $nivelData) {
                $nivel = [
                    'nivel' => $nivelData['nivel'] ?? null,
                    'siglas' => $nivelData['siglas'] ?? null,
                    'nombre' => $nivelData['nombre'] ?? null,
                    'escuela_procedencia' => $nivelData['escuela_procedencia'] ?? null,
                ];

                // Manejar archivos
                if (isset($nivelData['titulo_path']) && $nivelData['titulo_path'] instanceof \Illuminate\Http\UploadedFile) {
                    $nivel['titulo_path'] = $nivelData['titulo_path']->store('titulos', 'public');
                }
                
                if (isset($nivelData['cedula_path']) && $nivelData['cedula_path'] instanceof \Illuminate\Http\UploadedFile) {
                    $nivel['cedula_path'] = $nivelData['cedula_path']->store('cedulas', 'public');
                }

                // Si tiene ID, actualizar; si no, crear nuevo
                if (!empty($nivelData['id'])) {
                    $docente->niveles()->where('id', $nivelData['id'])->update($nivel);
                } else {
                    $docente->niveles()->create($nivel);
                }
            }
        }

        return redirect()->route('docentes.index')->with('success', 'Docente actualizado exitosamente');
 }
    public function destroy(Docente $docente)
    {
        $docente->delete();

        return redirect()->route('docentes.index')->with('success', 'Docente eliminado exitosamente');
    }
}
