<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Carrera;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class DocenteController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $docentes = Docente::query()
        ->when($search, function ($query, $search) {
            $query->where('nombres', 'ILIKE', "%{$search}%")
                  ->orWhere('apellido_paterno', 'ILIKE', "%{$search}%")
                  ->orWhere('apellido_materno', 'ILIKE', "%{$search}%");
        })
        ->orderBy('id', 'asc')
        ->get();

        return Inertia::render('docentes/Index', [
            'docentes' => $docentes,
            'filters' => ['search' => $search,
            ],
        ]);
    }

    public function create()
    {
        $carreras = Carrera::select('id', 'nombre')->get();
        return Inertia::render('docentes/Create', [
            'carreras' => $carreras,
        ]);
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
            'anio_ingreso' => 'required|integer',
            'carrera_id' => 'required|integer',

        ]);

        // Crear el docente
        $docente = Docente::create($docenteData);
        
        // Guardar niveles si existen - SIN validación estricta
        if ($request->has('niveles') && is_array($request->niveles)) {
            foreach ($request->niveles as $nivelData) {
                 if (empty($nivelData['nivel'])) {
                    continue;
                }
                $nivel = [
                    'nivel' => $nivelData['nivel'] ?? null,
                    'siglas' => $nivelData['siglas'] ?? null,
                    'nombre' => $nivelData['nombre'] ?? null,
                    'cedula' => $nivelData['cedula'] ?? null,
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

        return redirect()->route('docentes.show', $docente->id)
            ->with('success', 'Docente creado exitosamente');

    }
    
    public function show(Docente $docente)
    {
        $docente->load('experiencias', 'niveles', 'carrera'); // 'niveles' si quieres mostrar niveles de estudio
        $carreras = Carrera::select('id', 'nombre')->get();
        return Inertia::render('docentes/Detalles', [
            'docente' => $docente,
            'experiencias' => $docente->experiencias,
            'carreras' => $carreras,
        ]);
    }

    public function edit(Docente $docente)
    {
        $docente->load('niveles');
        $carreras = Carrera::select('id', 'nombre')->get();
        return Inertia::render('docentes/Edit', [
            'docente' => $docente,
            'carreras' => $carreras,
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
        'anio_ingreso' => 'required|integer',
        'carrera_id' => 'required|integer',
        ]);

        $docente->update($data);

        // ✅ Actualizar niveles existentes y crear nuevos
        if ($request->has('niveles')) {
            foreach ($request->niveles as $nivelData) {
                $nivel = [
                    'nivel' => $nivelData['nivel'] ?? null,
                    'siglas' => $nivelData['siglas'] ?? null,
                    'nombre' => $nivelData['nombre'] ?? null,
                    'cedula' => $nivelData['cedula'] ?? null,
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

        return redirect()->route('docentes.show', $docente->id)->with('success', 'Docente actualizado exitosamente');
    }

    public function destroy(Docente $docente)
    {
        $docente->delete();

        return redirect()->route('docentes.index')->with('success', 'Docente eliminado exitosamente');
    }

    public function generarReportePDF()
    {
        $reporteNivelPorCarrera = DB::table('nivel_estudios')
            ->join('docentes', 'nivel_estudios.docente_id', '=', 'docentes.id')
            ->join('carreras', 'docentes.carrera_id', '=', 'carreras.id')
            ->select(
                'carreras.nombre as carrera',
                'nivel_estudios.nivel',
                'docentes.nombres',
                'docentes.apellido_paterno',
                'docentes.apellido_materno',
                'docentes.sexo'
            )
            ->orderBy('carreras.nombre')
            ->orderBy('nivel_estudios.nivel')
            ->orderBy('docentes.apellido_paterno')
            ->get();

        // Agrupar primero por carrera, luego por nivel
        $reporteAgrupado = $reporteNivelPorCarrera->groupBy('carrera')->map(function ($carrera) {
            return $carrera->groupBy('nivel');
        });

        // Generar PDF
        $pdf = PDF::loadView('reportes.nivel-estudios-carrera', [
            'reporteAgrupado' => $reporteAgrupado,
            'fecha' => now()->format('d/m/Y H:i')
        ]);

        return $pdf->download('reporte-nivel-estudios-carrera.pdf');
    }
}
