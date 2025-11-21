<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Constancia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use App\Models\CursoInterno;
use App\Models\CursoExterno;

class ConstanciaController extends Controller
{
    public function index(Request $request)
    {
        $constancias = Constancia::with(['cursoInterno', 'cursoExterno'])
            ->when($request->search, function ($query, $search) {
                $query->where('nombre_completo', 'like', "%{$search}%")
                      ->orWhere('folio', 'like', "%{$search}%")
                      ->orWhere('nombre_curso', 'like', "%{$search}%");
            })
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->id,
                    'nombre_curso' => $c->nombre_curso,
                    'tipo' => 'Constancia',
                    'tipo_origen' => 'constancia',
                    'curso_interno' => $c->cursoInterno,
                    'curso_externo' => $c->cursoExterno,
                    'pdf_path' => $c->pdf_path,
                ];
            });

        // Obtener cursos internos
        $cursosInternos = CursoInterno::with('docentes')
            ->when($request->search, function ($query, $search) {
                $query->where('nombre', 'like', "%{$search}%")
                      ->orWhere('instructor', 'like', "%{$search}%");
            })
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->id,
                    'nombre_curso' => $c->nombre,
                    'tipo' => 'Curso Interno',
                    'tipo_origen' => 'curso_interno',
                    'curso_interno' => true,
                    'curso_externo' => null,
                    'pdf_path' => null,
                    'instructor' => $c->instructor,
                    'docentes' => $c->docentes,
                ];
            });

        // Obtener cursos externos
        $cursosExternos = CursoExterno::with('docentes')
            ->when($request->search, function ($query, $search) {
                $query->where('nombre', 'like', "%{$search}%")
                      ->orWhere('instructor', 'like', "%{$search}%");
            })
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->id,
                    'nombre_curso' => $c->nombre,
                    'tipo' => 'Curso Externo',
                    'tipo_origen' => 'curso_externo',
                    'curso_interno' => null,
                    'curso_externo' => true,
                    'pdf_path' => null,
                    'instructor' => $c->instructor,
                    'docentes' => $c->docentes,
                ];
            });

        // Combinar todos
        $todos = $constancias->concat($cursosInternos)->concat($cursosExternos)->sortByDesc('id');

        return Inertia::render('capacitaciones/constancia/Index', [
            'constancias' => $todos->values()
        ]);
        
    }

    public function create(Constancia $constancia)
    {
        $cursosInternos = CursoInterno::all();
        $cursosExternos = CursoExterno::all();

        return Inertia::render('capacitaciones/constancia/Create', [
            'cursosInternos' => $cursosInternos,
            'cursosExternos' => $cursosExternos,
        ]);
    }

    public function store(Request $request)
    {
        $constanciaData = $request->validate([
            'nombre_completo' => 'required|string',
            'curp' => 'required|string',
            'centro_adscripcion' => 'required|string',
            'periodo_inicio' => 'required|date',
            'periodo_fin' => 'required|date',
            'nombre_curso' => 'required|string',
            'modalidad' => 'required|in:Virtual,Presencial,Mixto',
            'horas' => 'required|integer',
            'folio' => 'required|string|unique:constancia,folio',
            'fecha_emision' => 'required|date',
            'autoridad_educativa' => 'required|string',
        ]);

        $constancia = Constancia::create($constanciaData);

         $pdf = Pdf::loadView('pdf.constancia', ['constancia' => $constancia]);

        // Guardar PDF en storage/app/public/constancias/
        $fileName = 'constancia_'.$constancia->folio.'.pdf';

        Storage::disk('public')->put('constancias/'.$fileName, $pdf->output());

        // Guardar ruta del PDF en la BD (necesitas una columna pdf_path)
        $constancia->update([
            'pdf_path' => 'constancias/'.$fileName,
        ]);

        return redirect()->route('capacitaciones.constancia.index')
            ->with('success', 'Constancia registrada correctamente.');
    }
}
