<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CursoInterno;
use App\Models\Docente;
use Illuminate\Support\Facades\Log;

class CursoInternoController extends Controller
{
    public function index(Request $request)
    {
        // Lógica para listar los cursos internos
    }

    public function create(CursoInterno $cursoInterno)
    {
         $docentes = Docente::select('id', 'nombres', 'apellido_paterno', 'apellido_materno')
            ->orderBy('nombres')  // Cambiado de 'nombre' a 'nombres'
            ->get()
            ->map(function ($docente) {
                return [
                    'id' => $docente->id,
                    'nombre_completo' => trim("{$docente->nombres} {$docente->apellido_paterno} {$docente->apellido_materno}")
                ];
            });
        return Inertia::render('capacitaciones/cursointerno/Create', [
            'cursoInterno' => $cursoInterno,
            'docentes' => $docentes,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string',
                'instructor' => 'required|string',
                'autoridad_educativa' => 'required|string',
                'docentes' => 'required|array|min:1',
                'docentes.*' => 'exists:docentes,id',
                'duracion_horas' => 'required|integer',
                'fecha_inicio' => 'required|date',
                'fecha_fin' => 'required|date',
                'tipo' => 'required|in:formacion,actualizacion',
                'modalidad' => 'required|in:virtual,presencial,mixto',
                'folio_fechaemision' => 'required|date',
                'modulo_horas' => 'required|integer',
                'modulo_calificacion' => 'required|numeric',
            ]);

            // Separar docentes ANTES de hacer unset
            $docentesIds = $validated['docentes'];
            
            // Ahora sí eliminamos docentes del array para crear el curso
            unset($validated['docentes']);

            // Crear el curso
            $curso = CursoInterno::create($validated);

            // Asociar los docentes
            $curso->docentes()->attach($docentesIds);

            return redirect()->route('capacitaciones.constancia.index')
                ->with('success', 'Curso interno registrado correctamente.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
            
        } catch (\Exception $e) {
            Log::error('Error al crear curso interno: ' . $e->getMessage());
            
            return back()
                ->with('error', 'Error al registrar el curso interno.')
                ->withInput();
        }
    }

    public function edit($id)
    {
        // Lógica para mostrar el formulario de edición
    }

    public function update(Request $request, $id)
    {
        // Lógica para actualizar un curso interno
    }

    public function destroy($id)
    {
        // Lógica para eliminar un curso interno
    }
}
