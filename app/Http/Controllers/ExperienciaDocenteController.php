<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia; 
use App\Models\Docente;
use App\Models\ExperienciaDocente; 

class ExperienciaDocenteController extends Controller
{
    public function index(Docente $docente)
    {
        return Inertia::render('experienciadocente/Index', [
            'docente' => $docente,
            'experiencias' => $docente->experiencias,
        ]);
    }

    public function create(Docente $docente)
    {
        $docente = Docente::findOrFail($docente->id);
        return Inertia::render('experienciadocente/Create', [
            'docente' => $docente,
        ]);
    }

    public function store(Request $request, Docente $docente)
    {
        $data = $request->validate([
            'horas_nombramiento' => 'nullable|string',
            'presidente_academia_inicio' => 'nullable|string',
            'presidente_academia_fin' => 'nullable|string',
            'perfildeseable_path' => 'nullable|file|mimes:pdf,jpg,png',
            'perfildeseable_fecha_inicio' => 'nullable|date',
            'perfildeseable_fecha_fin' => 'nullable|date',
            'cuerpoacademico_grado' => 'nullable|string',
            'cuerpoacademico_fecha_inicio' => 'nullable|date',
            'cuerpoacademico_fecha_fin' => 'nullable|date',
            'sni_anio' => 'nullable|integer',
            'sni_nivel' => 'nullable|string',
            'investigaciones' => 'nullable|string',
            'derecho_autor' => 'nullable|string',
            'titulo' => 'nullable|string',
            'rama' => 'nullable|string',
            'tipo' => 'nullable|string',
            'revista' => 'nullable|string',
            'fecha_publicacion' => 'nullable|date',
            'nombre_articulo' => 'nullable|string',
            'link' => 'nullable|url',
        ]);

        if ($request->hasFile('perfildeseable_path')) {
            $data['perfildeseable_path'] = $request->file('perfildeseable_path')->store('perfildeseables', 'public');
        }

        $docente->experiencias()->create($data);

        return redirect()->route('docentes.show', $docente->id)
            ->with('success', 'Experiencia docente agregada correctamente.');
    }

    public function edit(Docente $docente, ExperienciaDocente $experiencia)
    {
        $carreras = Carrera::select('id', 'nombre')->get();

        return Inertia::render('experienciadocente/Edit', [
            'docente' => $docente,
            'experiencia' => $experiencia,
        ]);
    }

    public function update(Request $request, Docente $docente, ExperienciaDocente $experiencia)
    {
        $data = $request->validate([
            'horas_nombramiento' => 'nullable|string',
            'presidente_academia_inicio' => 'nullable|string',
            'presidente_academia_fin' => 'nullable|string',
            'perfildeseable_path' => 'nullable|file|mimes:pdf,jpg,png',
            'perfildeseable_fecha_inicio' => 'nullable|date',
            'perfildeseable_fecha_fin' => 'nullable|date',
            'cuerpoacademico_grado' => 'nullable|string',
            'cuerpoacademico_fecha_inicio' => 'nullable|date',
            'cuerpoacademico_fecha_fin' => 'nullable|date',
            'sni_anio' => 'nullable|integer',
            'sni_nivel' => 'nullable|string',
            'investigaciones' => 'nullable|string',
            'derecho_autor' => 'nullable|string',
            'titulo' => 'nullable|string',
            'rama' => 'nullable|string',
            'tipo' => 'nullable|string',
            'revista' => 'nullable|string',
            'fecha_publicacion' => 'nullable|date',
            'nombre_articulo' => 'nullable|string',
            'link' => 'nullable|url',
            'ponencia' => 'nullable|string',
            'ponencia_inicio' => 'nullable|date',
            'ponencia_fin' => 'nullable|date',
            'instructor' => 'nullable|string',
            'instructor_inicio' => 'nullable|date',
            'instructor_fin' => 'nullable|date',
        ]);

        if ($request->hasFile('perfildeseable_path')) {
            $data['perfildeseable_path'] = $request->file('perfildeseable_path')->store('perfildeseables', 'public');
        }

        $experiencia->update($data);

        return redirect()->route('docentes.show', $docente->id)
            ->with('success', 'Experiencia docente actualizada correctamente.');
    }

    public function destroy(Docente $docente, ExperienciaDocente $experiencia)
    {
        $experiencia->delete();

        return redirect()->route('docentes.show', $docente->id)
            ->with('success', 'Experiencia docente eliminada correctamente.');
    }
}