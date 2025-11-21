<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CursoExterno;
use App\Models\Docente;
use Illuminate\Support\Facades\Log;

class CursoExternoController extends Controller
{
    public function create(CursoExterno $cursoExterno)
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
        return Inertia::render('capacitaciones/cursoexterno/Create', [
            'cursoExterno' => $cursoExterno,
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
            'tipo' => 'required|string',
            'modalidad' => 'required|string',
        ]);

            // Separar docentes ANTES de hacer unset
            $docentesIds = $validated['docentes'];
            
            // Ahora sí eliminamos docentes del array para crear el curso
            unset($validated['docentes']);

            // Crear el curso
            $curso = CursoExterno::create($validated);

            // Asociar los docentes
            $curso->docentes()->attach($docentesIds);

            return redirect()->route('capacitaciones.constancia.index')
                ->with('success', 'Curso externo registrado correctamente.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
            
        } catch (\Exception $e) {
            Log::error('Error al crear curso externo: ' . $e->getMessage());
            
            return back()
                ->with('error', 'Error al registrar el curso externo.')
                ->withInput();
        }
    }
}
