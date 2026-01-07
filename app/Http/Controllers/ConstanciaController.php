<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Constancia;
use App\Models\Docente;

class ConstanciaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
    
        $constancias = Constancia::with('docentes') // ✅ Cargar relación
            ->withCount('docentes') // ✅ Contar docentes
            ->when($search, function($query, $search) {
                $query->where('nombre', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('Capacitaciones/Index', [
            'constancias' => $constancias,
            'filters' => ['search' => $search]
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('capacitaciones/Create', [
            'docentes' => Docente::orderBy('nombres')->get(['id', 'nombres', 'apellido_paterno', 'apellido_materno']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo_curso' => 'required|string|max:255',
            'nombre' => 'required|string|max:255',
            'instructor' => 'required|string|max:255',
            'autoridad_educativa' => 'required|string|max:255',

            'docente_ids' => 'required|array|min:1',
            'docente_ids.*' => 'exists:docentes,id',

            'duracion_horas' => 'required|integer',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',

            'tipo' => 'required|string|max:100',
            'modalidad' => 'required|string|max:100',

            // ✅ Solo requeridos si tipo_curso es "interno"
            'folio_fechaemision' => 'required_if:tipo_curso,interno|nullable|string|max:100',
            'modulo_horas' => 'required_if:tipo_curso,interno|nullable|integer',
            'modulo_calificacion' => 'required_if:tipo_curso,interno|nullable|numeric|min:0|max:100',
        ]);

        // ✅ Filtrar solo los campos que no son null antes de crear
        $dataToCreate = collect($validated)
            ->except('docente_ids')
            ->filter(fn($value) => $value !== null) // Elimina los valores null
            ->toArray();

        // Crear capacitación
        $capacitacion = Constancia::create($dataToCreate);

        // Relación muchos a muchos
        $capacitacion->docentes()->sync($validated['docente_ids']);

        return redirect()
            ->route('capacitaciones.index')
            ->with('success', 'Constancia creada correctamente');
    }

    public function show($id)
    {
        $constancia = Constancia::with('docentes')->findOrFail($id);
        
        return Inertia::render('capacitaciones/Show', [
            'constancia' => $constancia
        ]);
    }

}
