<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ActivarDocente;
use App\Models\Docente;
use App\Models\Carrera;
use Illuminate\Support\Facades\DB;

class ActivarDocenteController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivarDocente::with(['docente', 'carrera']);

        // Filtro estado
        if ($request->filled('activo')) {
            $query->where('activo', $request->activo);
        }

        // Filtro semestre
        if ($request->filled('semestre')) {
            $query->where('semestre', $request->semestre);
        }

        // Filtro año
        if ($request->filled('anio')) {
            $query->where('anio', $request->anio);
        }

        // Filtro carrera
        if ($request->filled('carrera_id')) {
            $query->where('carrera_id', $request->carrera_id);
        }

        // Años disponibles
        $anios = ActivarDocente::select('anio')
            ->distinct()
            ->orderBy('anio', 'desc')
            ->pluck('anio');

        return Inertia::render('docentes/activardocente/Index', [
            'registros' => $query
                ->orderBy('anio', 'desc')
                ->orderBy('semestre', 'desc')
                ->get(),

            'filters' => $request->only([
                'activo',
                'semestre',
                'anio',
                'carrera_id'
            ]),

            'carreras' => Carrera::select('id', 'nombre')->get(),
            'anios' => $anios,
        ]);
    }


    public function create (Request $request)
    {
        return Inertia::render('docentes/activardocente/Create', [
            'docentes' => Docente::select('id','nombres','apellido_paterno', 'apellido_materno','carrera_id')->get(),
            'carreras' => Carrera::select('id', 'nombre')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'docente_id' => 'required|exists:docentes,id',
            'carrera_id' => 'required|exists:carreras,id',
            'semestre' => 'required|in:ENE-JUN,AGO-DIC',
            'anio' => 'required|integer|min:2000|max:2100',
            'activo' => 'required|boolean',
        ]);

        ActivarDocente::updateOrCreate(
            [
                'docente_id' => $validatedData['docente_id'],
                'carrera_id' => $validatedData['carrera_id'],
                'semestre' => $validatedData['semestre'],
                'anio' => $validatedData['anio'],
            ],
            [
                'activo' => $validatedData['activo'],
            ]
        );

        return redirect()
            ->route('docentes.activardocente.index')
            ->with('success', 'Estado del docente guardado correctamente');
    }

    public function edit(ActivarDocente $activardocente)
    {
        return Inertia::render('docentes/activardocente/Edit', [
            'registro' => $activardocente,
            'docentes' => Docente::select(
                'id','nombres','apellido_paterno','apellido_materno'
            )->get(),
            'carreras' => Carrera::select('id','nombre')->get(),
        ]);
    }

    public function update(Request $request, ActivarDocente $activardocente)
    {
        $validatedData = $request->validate([
            'docente_id' => 'required|exists:docentes,id',
            'carrera_id' => 'required|exists:carreras,id',
            'semestre' => 'required|in:ENE-JUN,AGO-DIC',
            'anio' => 'required|integer|min:2000|max:2100',
            'activo' => 'required|boolean',
        ]);

        $activardocente->update($validatedData);

        return redirect()
            ->route('docentes.activardocente.index')
            ->with('success', 'Estado del docente guardado correctamente');
    }

    public function destroy(ActivarDocente $activardocente)
    {
        $activardocente->delete();

       return redirect()
            ->route('docentes.activardocente.index')
            ->with('success', 'Eliminado exitosamente');
    }

}
