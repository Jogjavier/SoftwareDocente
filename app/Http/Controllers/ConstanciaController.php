<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Constancia;
use App\Models\Docente;
use Barryvdh\DomPDF\Facade\Pdf;

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
        
        return Inertia::render('capacitaciones/Index', [
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

    public function edit($id)
    {
        $constancia = Constancia::with('docentes')->findOrFail($id);
        $docentes = Docente::orderBy('apellido_paterno')->get();
        
        return Inertia::render('capacitaciones/Edit', [
            'constancia' => $constancia,
            'docentes' => $docentes
        ]);
    }

    public function update(Request $request, $id)
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

            'folio_fechaemision' => 'required_if:tipo_curso,interno|nullable|string|max:100',
            'modulo_horas' => 'required_if:tipo_curso,interno|nullable|integer',
            'modulo_calificacion' => 'required_if:tipo_curso,interno|nullable|numeric|min:0|max:100',
        ]);

        $capacitacion = Constancia::findOrFail($id);

        // Filtrar campos null
        $dataToUpdate = collect($validated)
            ->except('docente_ids')
            ->filter(fn($value) => $value !== null)
            ->toArray();

        // Actualizar capacitación
        $capacitacion->update($dataToUpdate);

        // Sincronizar docentes (elimina los anteriores y agrega los nuevos)
        $capacitacion->docentes()->sync($validated['docente_ids']);

        return redirect()
            ->route('capacitaciones.index')
            ->with('success', 'Capacitación actualizada correctamente');
    }

    public function destroy($id)
    {
        $capacitacion = Constancia::findOrFail($id);
        $capacitacion->docentes()->detach(); // Eliminar relaciones
        $capacitacion->delete();

        return redirect()
            ->route('capacitaciones.index')
            ->with('success', 'Capacitación eliminada correctamente');
    }

    public function createFacilitador($id)
    {
        $capacitacion = Constancia::findOrFail($id);

        return Inertia::render('capacitaciones/FacilitadorForm', [
            'capacitacion' => $capacitacion,
            'datos_default' => [
                'capacitacion_id' => $capacitacion->id,
                'nombre_completo' => $capacitacion->instructor,
                'curso' => $capacitacion->nombre,
                'horas' => $capacitacion->duracion_horas . ' horas',
                'fecha_inicio' => $capacitacion->fecha_inicio,
                'fecha_fin' => $capacitacion->fecha_fin,
                'lugar' => 'Santiago Papasquiaro, Durango',
                'nombre_director' => '',
                'puesto_director' => 'Director de Capacitación',
            ]
        ]);
    }

    /**
     * Genera el PDF de la constancia de facilitador
     */
    public function generateFacilitador(Request $request)
    {
        $validated = $request->validate([
            'capacitacion_id' => 'required|exists:capacitaciones,id',
            'nombre_completo' => 'required|string',
            'curso' => 'required|string',
            'horas' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date',
            'lugar' => 'required|string',
            'nombre_director' => 'required|string',
            'puesto_director' => 'required|string',
        ]);

        $capacitacion = Constancia::findOrFail($validated['capacitacion_id']);

        $fecha_inicio = \Carbon\Carbon::parse($validated['fecha_inicio'])->locale('es')->isoFormat('D [de] MMMM [de] YYYY');
        $fecha_fin = \Carbon\Carbon::parse($validated['fecha_fin'])->locale('es')->isoFormat('D [de] MMMM [de] YYYY');
        $fecha_expedicion = now()->locale('es')->isoFormat('D [de] MMMM [de] YYYY');

        $data = array_merge($validated, [
            'fecha_inicio_formateada' => $fecha_inicio,
            'fecha_fin_formateada' => $fecha_fin,
            'fecha_expedicion' => $fecha_expedicion,
            'capacitacion' => $capacitacion,
        ]);

        $pdf = Pdf::loadView('pdf.constancia-facilitador', $data)
            ->setPaper('letter', 'portrait');

        $filename = 'constancia-facilitador-' . str_replace(' ', '-', strtolower($validated['nombre_completo'])) . '-' . now()->format('Y-m-d') . '.pdf';

        // ✅ Usar download() para forzar la descarga
        return $pdf->download($filename);
    }

}
