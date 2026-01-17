<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Constancia;
use App\Models\Docente;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\SimpleType\Jc;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

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

    public function exportarReportePDF(Request $request)
    {
        try {
            $anio = $request->get('anio');
            $periodo = $request->get('periodo');

            \Log::info('Generando PDF', ['periodo' => $periodo, 'anio' => $anio]);

            // Si no hay filtros, obtener todos los años y periodos disponibles
            if (!$anio && !$periodo) {
                // Generar reporte completo de todos los años
                $anios = Constancia::distinct()->orderBy('anio', 'desc')->pluck('anio');
                
                $reportesPorPeriodo = [];
                
                foreach ($anios as $a) {
                    foreach (['ENE-JUN', 'AGO-DIC'] as $per) {
                        $query = Constancia::with(['docentes' => function($query) {
                            $query->select('docentes.id', 'nombres', 'apellido_paterno', 'apellido_materno')
                                ->orderBy('apellido_paterno')
                                ->orderBy('apellido_materno')
                                ->orderBy('nombres');
                        }]);

                        $query->where('periodo', $per);
                        $query->where('anio', $a);

                        $constancias = $query->orderBy('fecha_inicio', 'desc')->get();

                        if ($constancias->count() > 0) {
                            $reportesPorPeriodo[] = [
                                'periodo' => $per,
                                'anio' => $a,
                                'actualizacion' => $constancias->where('tipo', 'actualizacion'),
                                'formacion' => $constancias->where('tipo', 'formacion'),
                                'total' => $constancias->count(),
                            ];
                        }
                    }
                }
                
                $tituloReporte = 'Reporte Completo de Todos los Años';
                $nombreArchivo = 'reporte-cursos-completo.pdf';
                
            } else {
                // Si se especifica año pero no periodo, generar ambos semestres de ese año
                if ($anio && !$periodo) {
                    $periodos = ['ENE-JUN', 'AGO-DIC'];
                    $anioReporte = $anio;
                } 
                // Si se especifica periodo pero no año, generar ese periodo de todos los años
                elseif (!$anio && $periodo) {
                    $anios = Constancia::where('periodo', $periodo)
                        ->distinct()
                        ->orderBy('anio', 'desc')
                        ->pluck('anio');
                    $periodos = [$periodo];
                    $tituloReporte = "Reporte del Periodo {$periodo} - Todos los Años";
                }
                // Si se especifican ambos, generar solo ese periodo y año
                else {
                    $periodos = [$periodo];
                    $anioReporte = $anio;
                }

                $reportesPorPeriodo = [];

                // Si tenemos un año específico
                if (isset($anioReporte)) {
                    foreach ($periodos as $per) {
                        $query = Constancia::with(['docentes' => function($query) {
                            $query->select('docentes.id', 'nombres', 'apellido_paterno', 'apellido_materno')
                                ->orderBy('apellido_paterno')
                                ->orderBy('apellido_materno')
                                ->orderBy('nombres');
                        }]);

                        $query->where('periodo', $per);
                        $query->where('anio', $anioReporte);

                        $constancias = $query->orderBy('fecha_inicio', 'desc')->get();

                        $reportesPorPeriodo[] = [
                            'periodo' => $per,
                            'anio' => $anioReporte,
                            'actualizacion' => $constancias->where('tipo', 'actualizacion'),
                            'formacion' => $constancias->where('tipo', 'formacion'),
                            'total' => $constancias->count(),
                        ];
                    }
                    
                    $tituloReporte = count($periodos) == 1 
                        ? "Reporte {$periodos[0]} {$anioReporte}"
                        : "Reporte Anual {$anioReporte}";
                        
                    $nombreArchivo = count($periodos) == 1
                        ? "reporte-cursos-{$periodos[0]}-{$anioReporte}.pdf"
                        : "reporte-cursos-{$anioReporte}.pdf";
                }
                // Si solo tenemos periodo, todos los años
                else {
                    foreach ($anios as $a) {
                        $query = Constancia::with(['docentes' => function($query) {
                            $query->select('docentes.id', 'nombres', 'apellido_paterno', 'apellido_materno')
                                ->orderBy('apellido_paterno')
                                ->orderBy('apellido_materno')
                                ->orderBy('nombres');
                        }]);

                        $query->where('periodo', $periodos[0]);
                        $query->where('anio', $a);

                        $constancias = $query->orderBy('fecha_inicio', 'desc')->get();

                        if ($constancias->count() > 0) {
                            $reportesPorPeriodo[] = [
                                'periodo' => $periodos[0],
                                'anio' => $a,
                                'actualizacion' => $constancias->where('tipo', 'actualizacion'),
                                'formacion' => $constancias->where('tipo', 'formacion'),
                                'total' => $constancias->count(),
                            ];
                        }
                    }
                    
                    $nombreArchivo = "reporte-cursos-{$periodos[0]}-todos-años.pdf";
                }
            }

            \Log::info('Total de periodos a reportar: ' . count($reportesPorPeriodo));

            if (empty($reportesPorPeriodo)) {
                return response('No hay datos para generar el reporte con los filtros seleccionados', 404);
            }

            // Generar el PDF
            $pdf = PDF::loadView('reportes.cursos-periodo', [
                'reportesPorPeriodo' => $reportesPorPeriodo,
                'anio' => $anio ?? 'Todos los años',
                'tituloReporte' => $tituloReporte ?? ($anio ? "Reporte Anual {$anio}" : 'Reporte Completo'),
            ])->setPaper('letter', 'portrait');

            \Log::info('PDF generado exitosamente');

            return $pdf->download($nombreArchivo ?? 'reporte-cursos.pdf');

        } catch (\Exception $e) {
            \Log::error('Error generando PDF: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'error' => 'Error al generar el PDF',
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
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
            'periodo' => 'required|in:ENE-JUN,AGO-DIC',
            'anio' => 'required|integer',
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
            'periodo' => 'required|in:ENE-JUN,AGO-DIC',
            'anio' => 'required|integer',
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
                'lugar' => 'Sombrerete, Zacatecas',
                'nombre_director' => '',
                'puesto_director' => 'DIRECTORA GENERAL',
            ]
        ]);
    }

   public function generateFacilitador(Request $request)
    {
       try {
            $validated = $request->validate([
                'capacitacion_id' => 'required|exists:capacitaciones,id',
                'nombre_completo' => 'required|string',
                'curso'           => 'required|string',
                'horas'           => 'required|string',
                'fecha_inicio'    => 'required|date',
                'fecha_fin'       => 'required|date',
                'lugar'           => 'required|string',
                'nombre_director' => 'required|string',
                'puesto_director' => 'required|string',
            ]);

            $phpWord = new \PhpOffice\PhpWord\PhpWord();

            // Configuración de la sección solo con margen y borde superior
            $section = $phpWord->addSection([
                'marginTop'        => 850,
                'marginBottom'     => 850,
                'marginLeft'       => 0,
                'marginRight'      => 0,
                // Solo borde superior
                'borderTopColor'   => 'FFFFFF',
                'borderTopSize'    => 12,
            ]);

            /*
            |---------------------------------------------------------
            | FRANJA LATERAL DERECHA (FUERA DEL MARCO)
            |---------------------------------------------------------
            */
            $franjaPath = public_path('storage/franja.png');
            if (file_exists($franjaPath)) {
                $section->addImage($franjaPath, [
                    'width'            => 90,
                    'height'           => 842,
                    'positioning'      => 'absolute',
                    'posHorizontal'    => 'absolute',
                    'posVertical'      => 'absolute',
                    'left'             => 545,
                    'top'              => 0,
                    'posHorizontalRel' => 'page',
                    'posVerticalRel'   => 'page',
                    'wrappingStyle'    => 'behind',
                ]);
            }

            /*
            |---------------------------------------------------------
            | LOGOS SUPERIORES (UNO AL LADO DEL OTRO)
            |---------------------------------------------------------
            */
            $section->addTextBreak(1);
            
            // TextRun alineado a la izquierda para los logos
            $logosRun = $section->addTextRun(['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::LEFT, 'indentation' => ['left' => 200]]);
            
            // Logo Educación
            $logosRun->addImage(public_path('storage/educacion.png'), [
                'width'  => 200,
                'height' => 60,
            ]);
            
            // Logo TecNM
            $logosRun->addImage(public_path('storage/tecnm.png'), [
                'width'  => 160,
                'height' => 60,
            ]);
            
            // Logo Secretaría
            $logosRun->addImage(public_path('storage/secretaria.png'), [
                'width'  => 160,
                'height' => 60,
            ]);

            /*
            |---------------------------------------------------------
            | CUERPO DEL DOCUMENTO (CENTRADO)
            |---------------------------------------------------------
            */
            
            $section->addTextBreak(2);
            
            // Encabezado principal
            $section->addText(
                'EL TECNOLÓGICO NACIONAL DE MÉXICO',
                ['size' => 14, 'bold' => true, 'color' => '969696'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 100]
            );

            $section->addText(
                'A TRAVÉS DEL INSTITUTO TECNOLÓGICO SUPERIOR ZACATECAS OCCIDENTE',
                ['size' => 12, 'color' => '969696'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 100]
            );

            $section->addText(
                'OTORGA LA PRESENTE:',
                ['size' => 12, 'color' => 'ACACAC'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 400]
            );

            // CONSTANCIA
            $section->addText(
                'CONSTANCIA',
                ['size' => 40, 'bold' => true, 'color' => 'D4A548'], 
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 500]
            );

            // A: Nombre
            $run = $section->addTextRun(['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 400]);
            $run->addText('A: ', ['size' => 14, 'color' => '000000']);
            $run->addText(strtoupper($validated['nombre_completo']), [
                'size' => 14,
                'color' => '6B6B6B',
                'bold' => false
            ]);

            // Párrafo "Por su participación como facilitador..."
            $runText = $section->addTextRun([
                'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                'spaceAfter' => 100
            ]);
            $runText->addText('Por su participación como ', ['size' => 13, 'color' => '000000']);
            $runText->addText('facilitador', ['size' => 13, 'color' => 'C00000', 'bold' => true]);
            $runText->addText(' del curso de', ['size' => 13, 'color' => '000000']);

            // Segunda línea: "formación denominado"
            $runText2 = $section->addTextRun([
                'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                'spaceAfter' => 100
            ]);
            $runText2->addText('formación', ['size' => 13, 'color' => 'C00000', 'underline' => 'single']);
            $runText2->addText(' denominado', ['size' => 13, 'color' => '000000']);

            // Nombre del curso
            $section->addText(
                '"' . $validated['curso'] . '"',
                ['size' => 13, 'color' => '000000'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 200]
            );

            // Fecha
            $fechaInicio = \Carbon\Carbon::parse($validated['fecha_inicio'])->locale('es')->isoFormat('D [de] MMMM [de] YYYY');
            $section->addText(
                "Impartido el día {$fechaInicio}.",
                ['size' => 13, 'color' => '000000'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 100]
            );
            
            // Duración
            $section->addText(
                "Con una duración de {$validated['horas']} horas",
                ['size' => 13, 'color' => '000000'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 1000]
            );

            /*
            |---------------------------------------------------------
            | LÍNEA DE FIRMA Y DATOS DEL FIRMANTE
            |---------------------------------------------------------
            */
            
            // Línea para la firma (centrada)
            $section->addText(
                '_______________________________________________',
                ['size' => 12, 'color' => '000000'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 100]
            );
            
            // Nombre del director
            $section->addText(
                strtoupper($validated['nombre_director']),
                ['size' => 12, 'color' => '000000'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 50]
            );
            
            // Puesto del director
            $section->addText(
                strtoupper($validated['puesto_director']),
                ['size' => 12, 'bold' => true, 'color' => '000000'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 500]
            );

            // Fecha y lugar
            $section->addText(
                $validated['lugar'] . ', Zac. a ' . now()->locale('es')->isoFormat('D [de] MMMM [de] YYYY'),
                ['size' => 12, 'color' => 'D4A548'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER]
            );

            /*
            |---------------------------------------------------------
            | LOGO INFERIOR (Con márgenes en las orillas)
            |---------------------------------------------------------
            */
            $section->addTextBreak(2);
            
            // Usar TextRun para agregar márgenes laterales
            $logoInferiorRun = $section->addTextRun([
                'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::LEFT,
                'indentation' => [
                    'left' => 200,   // Margen izquierdo
                    'right' => 200   // Margen derecho
                ]
            ]);
            
            $logoInferiorRun->addImage(public_path('storage/ITSZO.png'), [
                'width'  => 80,
                'height' => 80,
            ]);

            /*
            |---------------------------------------------------------
            | GUARDAR Y DESCARGAR
            |---------------------------------------------------------
            */
            $fileName = 'constancia-' . \Illuminate\Support\Str::slug($validated['nombre_completo']) . '.docx';
            $path = storage_path('app/' . $fileName);

            $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
            $objWriter->save($path);

            return response()->download($path)->deleteFileAfterSend(true);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Actualiza también el método createDocentes para pasar los docentes
    public function createDocentes($id)
    {
        $capacitacion = Constancia::with('docentes')->findOrFail($id);

        return Inertia::render('capacitaciones/DocentesForm', [
            'capacitacion' => $capacitacion,
            'docentes' => $capacitacion->docentes, // 🔥 IMPORTANTE: Pasar los docentes
            'datos_default' => [
                'capacitacion_id' => $capacitacion->id,
                'curso' => $capacitacion->nombre,
                'horas' => $capacitacion->duracion_horas . ' horas',
                'fecha_inicio' => $capacitacion->fecha_inicio,
                'fecha_fin' => $capacitacion->fecha_fin,
                'lugar' => 'Sombrerete, Zacatecas',
                'nombre_director' => '',
                'puesto_director' => 'DIRECTORA GENERAL',
            ]
        ]);
    }

    public function generateDocentes(Request $request)
{
    try {
        // Validar datos base
        $validated = $request->validate([
            'capacitacion_id' => 'required|exists:capacitaciones,id',
            'curso' => 'required|string',
            'horas' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date',
            'lugar' => 'required|string',
            'nombre_director' => 'required|string',
            'puesto_director' => 'required|string',
        ]);

        \Log::info('Generando constancias para capacitación ID: ' . $validated['capacitacion_id']);

        $capacitacion = Constancia::with('docentes')->findOrFail($validated['capacitacion_id']);

        // Verificar que haya docentes
        if ($capacitacion->docentes->isEmpty()) {
            \Log::warning('No hay docentes para la capacitación ' . $capacitacion->id);
            return response()->json([
                'message' => 'No hay docentes registrados para esta capacitación'
            ], 400);
        }

        \Log::info('Docentes encontrados: ' . $capacitacion->docentes->count());

        // Crear nombre del ZIP
        $zipFileName = "constancias-docentes-{$capacitacion->id}-" . date('Ymd-His') . ".zip";
        $zipPath = storage_path("app/{$zipFileName}");
        
        \Log::info('Ruta del ZIP: ' . $zipPath);

        // Crear ZIP
        $zip = new \ZipArchive();
        $zipStatus = $zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

        if ($zipStatus !== true) {
            \Log::error('No se pudo crear el ZIP. Código de error: ' . $zipStatus);
            throw new \Exception('No se pudo crear el archivo ZIP. Código: ' . $zipStatus);
        }

        \Log::info('ZIP creado exitosamente');

        $archivosTemporales = [];
        $contador = 0;

        // Generar constancia para cada docente
        foreach ($capacitacion->docentes as $docente) {
            $nombreCompleto = trim(
                "{$docente->nombres} {$docente->apellido_paterno} {$docente->apellido_materno}"
            );

            \Log::info("Generando constancia para: {$nombreCompleto}");

            $phpWord = new \PhpOffice\PhpWord\PhpWord();

            // Configuración de la sección solo con margen y borde superior
            $section = $phpWord->addSection([
                'marginTop'        => 850,
                'marginBottom'     => 850,
                'marginLeft'       => 0,
                'marginRight'      => 0,
                // Solo borde superior
                'borderTopColor'   => 'FFFFFF',
                'borderTopSize'    => 12,
            ]);

            /*
            |---------------------------------------------------------
            | FRANJA LATERAL DERECHA (FUERA DEL MARCO)
            |---------------------------------------------------------
            */
            $franjaPath = public_path('storage/franja.png');
            if (file_exists($franjaPath)) {
                $section->addImage($franjaPath, [
                    'width'            => 90,
                    'height'           => 842,
                    'positioning'      => 'absolute',
                    'posHorizontal'    => 'absolute',
                    'posVertical'      => 'absolute',
                    'left'             => 545,
                    'top'              => 0,
                    'posHorizontalRel' => 'page',
                    'posVerticalRel'   => 'page',
                    'wrappingStyle'    => 'behind',
                ]);
            }

            /*
            |---------------------------------------------------------
            | LOGOS SUPERIORES (UNO AL LADO DEL OTRO)
            |---------------------------------------------------------
            */
            $section->addTextBreak(1);
            
            // TextRun alineado a la izquierda para los logos
            $logosRun = $section->addTextRun(['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::LEFT, 'indentation' => ['left' => 200]]);
            
            // Logo Educación
            $logosRun->addImage(public_path('storage/educacion.png'), [
                'width'  => 200,
                'height' => 60,
            ]);
            
            // Logo TecNM
            $logosRun->addImage(public_path('storage/tecnm.png'), [
                'width'  => 160,
                'height' => 60,
            ]);
            
            // Logo Secretaría
            $logosRun->addImage(public_path('storage/secretaria.png'), [
                'width'  => 160,
                'height' => 60,
            ]);

            /*
            |---------------------------------------------------------
            | CUERPO DEL DOCUMENTO (CENTRADO)
            |---------------------------------------------------------
            */
            
            $section->addTextBreak(2);
            
            // Encabezado principal
            $section->addText(
                'EL TECNOLÓGICO NACIONAL DE MÉXICO',
                ['size' => 14, 'bold' => true, 'color' => '969696'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 100]
            );

            $section->addText(
                'A TRAVÉS DEL INSTITUTO TECNOLÓGICO SUPERIOR ZACATECAS OCCIDENTE',
                ['size' => 12, 'color' => '969696'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 100]
            );

            $section->addText(
                'OTORGA LA PRESENTE:',
                ['size' => 12, 'color' => 'ACACAC'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 400]
            );

            // CONSTANCIA
            $section->addText(
                'CONSTANCIA',
                ['size' => 40, 'bold' => true, 'color' => 'D4A548'], 
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 500]
            );

            // A: Nombre
            $run = $section->addTextRun(['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 400]);
            $run->addText('A: ', ['size' => 14, 'color' => '000000']);
            $run->addText(strtoupper($nombreCompleto), [
                'size' => 14,
                'color' => '6B6B6B',
                'bold' => false
            ]);

            // Párrafo "Por su participación como facilitador..."
            $runText = $section->addTextRun([
                'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                'spaceAfter' => 100
            ]);
            $runText->addText('Por su participación como ', ['size' => 13, 'color' => '000000']);
            $runText->addText('docente', ['size' => 13, 'color' => 'C00000', 'bold' => true]); // ← CAMBIO: "docente" en lugar de "facilitador"
            $runText->addText(' del curso de', ['size' => 13, 'color' => '000000']);

            // Segunda línea: "formación denominado"
            $runText2 = $section->addTextRun([
                'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                'spaceAfter' => 100
            ]);
            $runText2->addText('formación', ['size' => 13, 'color' => 'C00000', 'underline' => 'single']);
            $runText2->addText(' denominado', ['size' => 13, 'color' => '000000']);

            // Nombre del curso
            $section->addText(
                '"' . $validated['curso'] . '"',
                ['size' => 13, 'color' => '000000'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 200]
            );

            // Fecha
            $fechaInicio = \Carbon\Carbon::parse($validated['fecha_inicio'])->locale('es')->isoFormat('D [de] MMMM [de] YYYY');
            $section->addText(
                "Impartido el día {$fechaInicio}.",
                ['size' => 13, 'color' => '000000'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 100]
            );
            
            // Duración
            $section->addText(
                "Con una duración de {$validated['horas']} horas",
                ['size' => 13, 'color' => '000000'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 1000]
            );

            /*
            |---------------------------------------------------------
            | LÍNEA DE FIRMA Y DATOS DEL FIRMANTE
            |---------------------------------------------------------
            */
            
            // Línea para la firma (centrada)
            $section->addText(
                '_______________________________________________',
                ['size' => 12, 'color' => '000000'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 100]
            );
            
            // Nombre del director
            $section->addText(
                strtoupper($validated['nombre_director']),
                ['size' => 12, 'color' => '000000'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 50]
            );
            
            // Puesto del director
            $section->addText(
                strtoupper($validated['puesto_director']),
                ['size' => 12, 'bold' => true, 'color' => '000000'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 500]
            );

            // Fecha y lugar
            $section->addText(
                $validated['lugar'] . ', Zac. a ' . now()->locale('es')->isoFormat('D [de] MMMM [de] YYYY'),
                ['size' => 12, 'color' => 'D4A548'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER]
            );

            /*
            |---------------------------------------------------------
            | LOGO INFERIOR (Con márgenes en las orillas)
            |---------------------------------------------------------
            */
            $section->addTextBreak(2);
            
            // Usar TextRun para agregar márgenes laterales
            $logoInferiorRun = $section->addTextRun([
                'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::LEFT,
                'indentation' => [
                    'left' => 200,   // Margen izquierdo
                    'right' => 200   // Margen derecho
                ]
            ]);
            
            $logoInferiorRun->addImage(public_path('storage/ITSZO.png'), [
                'width'  => 80,
                'height' => 80,
            ]);

            // Guardar archivo temporal
            $fileName = 'constancia-' . \Illuminate\Support\Str::slug($nombreCompleto) . '.docx';
            $tempPath = storage_path('app/' . $fileName);
            
            $writer = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
            $writer->save($tempPath);
            
            \Log::info("Archivo guardado: {$tempPath}");
            
            // Agregar al ZIP
            if (file_exists($tempPath)) {
                $zip->addFile($tempPath, $fileName);
                $archivosTemporales[] = $tempPath;
                $contador++;
                \Log::info("Archivo agregado al ZIP: {$fileName}");
            } else {
                \Log::error("No se pudo encontrar el archivo temporal: {$tempPath}");
            }
        }

        $zip->close();

        \Log::info("ZIP cerrado. Total de archivos: {$contador}");
        \Log::info("Ruta del ZIP: {$zipPath}");

        // Verificar que el ZIP se creó correctamente
        if (!file_exists($zipPath)) {
            throw new \Exception('El archivo ZIP no se creó correctamente');
        }

        // Limpiar archivos temporales
        foreach ($archivosTemporales as $file) {
            if (file_exists($file)) {
                @unlink($file);
            }
        }

        \Log::info("Descargando ZIP...");

        // Devolver el archivo para descarga
        return response()->download($zipPath, $zipFileName, [
            'Content-Type' => 'application/zip',
        ])->deleteFileAfterSend(true);

    } catch (\Illuminate\Validation\ValidationException $e) {
        \Log::error('Error de validación: ' . json_encode($e->errors()));
        return response()->json([
            'message' => 'Error de validación',
            'errors' => $e->errors()
        ], 422);
        
    } catch (\Exception $e) {
        \Log::error('Error generando constancias múltiples: ' . $e->getMessage());
        \Log::error($e->getTraceAsString());
        
        return response()->json([
            'message' => 'Error al generar las constancias',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
