<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\EvaluacionDepartamental;
use App\Models\Docente;
use App\Models\Carrera;
use Illuminate\Support\Facades\DB;

class EvaluacionDepartamentalController extends Controller
{
    public function index()
    {
        return Inertia::render('evaluaciones/evaluaciondepartamental/Index', [
        'evaluaciones' => EvaluacionDepartamental::with(['docente', 'carrera'])->get(),
        ]);
    }

    public function porDocente()
    {
        return Inertia::render('evaluaciones/evaluaciondepartamental/PorDocente', [
            'docentes' => Docente::select('id','nombres','apellido_paterno', 'apellido_materno','carrera_id')->get(),
            'carreras' => Carrera::select('id','nombre')->get(),
        ]);
    }

    public function porCarrera()
    {
        return Inertia::render('evaluaciones/evaluaciondepartamental/PorCarrera', [
            'carreras' => Carrera::select('id','nombre')->get(),
        ]);
    }

    public function general()
    {
        return Inertia::render('evaluaciones/evaluaciondepartamental/General', [
            'carreras' => Carrera::select('id','nombre')->get(),
        ]);
    }

    public function dataPorDocente($id)
    {
        // Todas las evaluaciones del docente ordenadas por año y periodo
        $evaluaciones = EvaluacionDepartamental::where('docente_id', $id)
            ->orderBy('anio', 'asc')
            ->orderBy('periodo', 'asc')
            ->get();

        // Promedios por periodo y año (resultado_global) para línea
        $promediosPeriodo = EvaluacionDepartamental::select(
                'periodo', 
                'anio',
                DB::raw('AVG(resultado_global) as promedio')
            )
            ->where('docente_id', $id)
            ->groupBy('periodo', 'anio')
            ->orderBy('anio', 'asc')
            ->orderBy('periodo', 'asc')
            ->get()
            ->map(function($item) {
                // Crear un campo combinado para mostrar en gráficas
                $item->periodo_completo = $item->periodo . ' ' . $item->anio;
                return $item;
            });

        return response()->json([
            'evaluaciones' => $evaluaciones,
            'promediosPeriodo' => $promediosPeriodo,
        ]);
    }

    // Datos por carrera: lista de evaluaciones y promedios por docente
    public function dataPorCarrera($carreraId)
    {
        $evaluaciones = EvaluacionDepartamental::where('carrera_id', $carreraId)
            ->with(['docente:id,nombres,apellido_paterno,apellido_materno'])
            ->orderBy('anio', 'asc')
            ->orderBy('periodo', 'asc')
            ->get()
            ->map(function($item) {
                // Agregar campo combinado para facilitar la visualización
                $item->semestre_completo = $item->periodo . ' ' . $item->anio;
                return $item;
            });

        // Promedio por docente (resultado_global)
        $promedioPorDocente = EvaluacionDepartamental::select('docente_id', DB::raw('AVG(resultado_global) as promedio'))
            ->where('carrera_id', $carreraId)
            ->groupBy('docente_id')
            ->get();

        // Adjuntar nombres de docente a los promedios
        $promedioPorDocente->transform(function($item){
            $doc = Docente::find($item->docente_id);
            $item->docente = $doc ? ($doc->nombres . ' ' . $doc->apellido_paterno . ' ' . $doc->apellido_materno) : null;
            return $item;
        });

        // Promedios por periodo y año (general de la carrera)
        $promediosSemestre = EvaluacionDepartamental::select(
                'periodo', 
                'anio',
                DB::raw('AVG(resultado_global) as promedio')
            )
            ->where('carrera_id', $carreraId)
            ->groupBy('periodo', 'anio')
            ->orderBy('anio', 'asc')
            ->orderBy('periodo', 'asc')
            ->get()
            ->map(function($item) {
                $item->semestre_completo = $item->periodo . ' ' . $item->anio;
                return $item;
            });

        return response()->json([
            'evaluaciones' => $evaluaciones,
            'promedioPorDocente' => $promedioPorDocente,
            'promediosSemestre' => $promediosSemestre,
        ]);
    }

    // Histórico general: promedio por carrera y por periodo
    public function dataGeneral()
    {
        // Promedio global por carrera
        $promedioPorCarrera = EvaluacionDepartamental::select('carrera_id', DB::raw('AVG(resultado_global) as promedio'))
            ->groupBy('carrera_id')
            ->get()
            ->map(function($item){
                $c = Carrera::find($item->carrera_id);
                return [
                    'carrera_id' => $item->carrera_id,
                    'carrera' => $c?->nombre,
                    'promedio' => round($item->promedio, 2),
                ];
            });

        // Promedios generales por periodo y año (todas las carreras)
        $promediosSemestre = EvaluacionDepartamental::select(
                'periodo', 
                'anio',
                DB::raw('AVG(resultado_global) as promedio')
            )
            ->groupBy('periodo', 'anio')
            ->orderBy('anio', 'asc')
            ->orderBy('periodo', 'asc')
            ->get()
            ->map(function($item) {
                $item->semestre_completo = $item->periodo . ' ' . $item->anio;
                return $item;
            });

        return response()->json([
            'promedioPorCarrera' => $promedioPorCarrera,
            'promediosSemestre' => $promediosSemestre,
        ]);
    }

    public function create (Request $request)
    {
        return Inertia::render('evaluaciones/evaluaciondepartamental/Create', [
            'docentes' => Docente::all(),
            'carreras' => Carrera::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
        'docente_id' => 'required|exists:docentes,id',
        'carrera_id' => 'required|exists:carreras,id',
        'periodo'   => 'required|in:ENE-JUN,AGO-DIC',
        'anio'      => 'required|digits:4|integer|min:2000|max:' . (date('Y') + 1),

        'docencia'   => 'required|numeric|min:1|max:10',
        'tutoria'   => 'required|numeric|min:1|max:10',
        'vinculacion'   => 'required|numeric|min:1|max:10',
        'gestion'   => 'required|numeric|min:1|max:10',
        'global'   => 'required|numeric|min:1|max:10',
        'resultado_global'      => 'required|numeric|min:1|max:10',
    ]);

    $evaluacion = EvaluacionDepartamental::create($validatedData);
    return redirect()
        ->route('evaluaciones.evaluaciondepartamental.index')
        ->with('success', 'Evaluación guardada exitosamente.');
    }

    public function edit (Request $request, EvaluacionDepartamental $evaluaciondepartamental)
    {
        return Inertia::render('evaluaciones/evaluaciondepartamental/Edit', [
            'docentes' => Docente::all(),
            'carreras' => Carrera::all(),
            'evaluacion' => $evaluaciondepartamental, 
        ]);
    }

    public function update(Request $request, EvaluacionDepartamental $evaluaciondepartamental)
    {
        $validatedData = $request->validate([
        'docente_id' => 'required|exists:docentes,id',
        'carrera_id' => 'required|exists:carreras,id',
        'periodo'   => 'required|in:ENE-JUN,AGO-DIC',
        'anio'      => 'required|digits:4|integer|min:2000|max:' . (date('Y') + 1),

        'docencia'   => 'required|numeric|min:1|max:10',
        'tutoria'   => 'required|numeric|min:1|max:10',
        'vinculacion'   => 'required|numeric|min:1|max:10',
        'gestion'   => 'required|numeric|min:1|max:10',
        'global'   => 'required|numeric|min:1|max:10',
        'resultado_global'      => 'required|numeric|min:1|max:10',
    ]);

    $evaluaciondepartamental->update($validatedData);
    return redirect()
        ->route('evaluaciones.evaluaciondepartamental.index')
        ->with('success', 'Evaluación guardada exitosamente.');
    }

    public function destroy(EvaluacionDepartamental $evaluaciondepartamental)
    {
        $evaluaciondepartamental->delete();

        return redirect()->route('evaluaciones.evaluaciondepartamental.index')->with('success', 'Evaluacion Departamental eliminada exitosamente');
    }
}
