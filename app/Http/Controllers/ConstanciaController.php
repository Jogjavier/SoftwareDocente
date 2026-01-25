<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Constancia;
use App\Models\Docente;
use App\Models\Constancias;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\SimpleType\Jc;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Writer\PngWriter;
use PhpOffice\PhpWord\SimpleType\JcTable;

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
                'tipo'       => 'required|in:actualizacion,formacion',
                'modalidad'        => 'required|in:presencial,virtual,mixta',
                'horas'           => 'required|string',
                'fecha_inicio'    => 'required|date',
                'fecha_fin'       => 'required|date',
                'lugar'           => 'required|string',
                'fecha_emision' => 'required|date',
                'nombre_director' => 'required|string',
                'puesto_director' => 'required|string',
            ]);

            \Log::info('Generando constancia para facilitador: ' . $validated['nombre_completo']);

            // Obtener la capacitación para el folio
            $capacitacion = Constancia::findOrFail($validated['capacitacion_id']);
            
            // Generar hash único para validación
            $hash = (string) Str::uuid();

            // Crear registro de constancia emitida
            $constanciaEmitida = Constancias::create([
                'capacitacion_id'     => $validated['capacitacion_id'],
                'folio'               => $capacitacion->folio_fechaemision . '-' . strtoupper(Str::random(5)),
                'tipo'                => 'facilitador',
                'nombre_beneficiario' => $validated['nombre_completo'],
                'fecha_emision'       => now(),
                'hash'                => $hash,
            ]);

            \Log::info('Constancia registrada con folio: ' . $constanciaEmitida->folio);

            // Generar código QR
            $url = route('constancias.validar', $hash);
            $qrPath = storage_path("app/qr-{$hash}.png");

            $result = Builder::create()
                ->writer(new PngWriter())
                ->data($url)
                ->size(300)
                ->margin(10)
                ->build();

            $result->saveToFile($qrPath);

            \Log::info('QR generado en: ' . $qrPath);

            $phpWord = new \PhpOffice\PhpWord\PhpWord();
    

            // Configuración de la sección
            $section = $phpWord->addSection([
                'marginTop'        => 850,
                'marginBottom'     => 850,
                'marginLeft'       => 0,
                'marginRight'      => 0,
                'borderTopColor'   => 'FFFFFF',
                'borderTopSize'    => 12,
            ]);

            /*
            |---------------------------------------------------------
            | LOGOS SUPERIORES (UNO AL LADO DEL OTRO)
            |---------------------------------------------------------
            */
            $section->addTextBreak(1);
            
            // TextRun alineado a la izquierda para los logos
            $logosRun = $section->addTextRun([
                'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::LEFT, 
                'indentation' => ['left' => 200]
            ]);
            
            // Logo Educación
            if (file_exists(public_path('storage/educacion.png'))) {
                $logosRun->addImage(public_path('storage/educacion.png'), [
                    'width'  => 200,
                    'height' => 60,
                ]);
            }
            
            // Logo TecNM
            if (file_exists(public_path('storage/tecnm.png'))) {
                $logosRun->addImage(public_path('storage/tecnm.png'), [
                    'width'  => 160,
                    'height' => 60,
                ]);
            }
            
            // Logo Secretaría
            if (file_exists(public_path('storage/secretaria.png'))) {
                $logosRun->addImage(public_path('storage/secretaria.png'), [
                    'width'  => 160,
                    'height' => 60,
                ]);
            }

            /*
            |---------------------------------------------------------
            | CUERPO DEL DOCUMENTO
            |---------------------------------------------------------
            */
            
            $section->addTextBreak(2);
            
            // Encabezado principal
            $section->addText(
                'EL Tecnológico Nacional de México',
                ['size' => 18, 'bold' => true, 'color' => '969696'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 100]
            );

            $section->addText(
                'a través del Instituto Tecnológico Superior Zacatecas Occidente',
                ['size' => 14, 'bold' => true, 'color' => '969696'],
                [
                    'alignment'   => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                    'spaceAfter' => 400 // espacio debajo de este texto
                ]
            );

            $section->addText(
                'OTORGA LA PRESENTE:',
                ['size' => 16, 'bold' => true, 'color' => '969696'],
                [
                    'alignment'    => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                    'spaceBefore' => 200 // espacio arriba de este texto
                ]
            );

            // CONSTANCIA
            $section->addText(
                'CONSTANCIA',
                ['size' => 50, 'bold' => true, 'color' => 'D4A548'], 
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 300]
            );

            $section->addText(
                'A',
                ['size' => 16, 'bold' => true, 'color' => '969696'],
                [
                    'alignment'    => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                    'spaceBefore' => 200 // espacio arriba de este texto
                ]
            );

            // A: Nombre
            $run = $section->addTextRun([
                'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 
                'spaceAfter' => 400
            ]);
            $run->addText(strtoupper($validated['nombre_completo']), [
                'size' => 16, 'bold' => true, 'color' => '969696']
            );

            // Párrafo "Por su participación como facilitador..."
            $runText = $section->addTextRun([
                'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                'spaceAfter' => 100
            ]);

            // Determinar tipo de curso
            $tipoCursoTexto = $validated['tipo'] === 'actualizacion'
                ? 'Actualización'
                : 'Formación';

            $run = $section->addTextRun([
                'alignment' => Jc::CENTER,
                'spaceAfter' => 150
            ]);

            $run->addText('Por su participación como ', ['size' => 13, 'color' => '969696']);
            $run->addText('facilitador', ['size' => 13, 'bold' => true, 'color' => '969696']);
            $run->addText(' del curso de ', ['size' => 13, 'color' => '969696']);
            $run->addText($tipoCursoTexto, ['size' => 13, 'color' => '969696']);
            $run->addText(' denominado:', ['size' => 13, 'color' => '969696']);

            $section->addText(
                strtoupper($validated['curso']),
                ['size' => 13, 'bold' => true, 'color' => '969696'],
                ['alignment' => Jc::CENTER, 'spaceAfter' => 150]
            );

            $run = $section->addTextRun([
                'alignment' => Jc::CENTER,
                'spaceAfter' => 200
            ]);

            $run->addText(
                "con una duración de {$validated['horas']} horas en la modalidad ",
                ['size' => 13, 'color' => '969696']
            );

            $run->addText(
                $validated['modalidad'],
                ['size' => 13, 'bold' => true, 'color' => '969696']
            );

            $fechaInicio = Carbon::parse($validated['fecha_inicio'])
                ->locale('es')
                ->isoFormat('D [de] MMMM');

            $fechaFin = Carbon::parse($validated['fecha_fin'])
                ->locale('es')
                ->isoFormat('D [de] MMMM [de] YYYY');

            $section->addText(
                "Impartido del {$fechaInicio} al {$fechaFin}.",
                ['size' => 13, 'color' => '969696'],
                ['alignment' => Jc::CENTER, 'spaceAfter' => 300]
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
            $nombreDirector = mb_convert_case(
                $validated['nombre_director'],
                MB_CASE_TITLE,
                'UTF-8'
            );

            $section->addText(
                $nombreDirector,
                ['size' => 12, 'color' => '969696', 'bold' => true],
                [
                    'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                    'spaceAfter' => 50
                ]
            );
            
            // Puesto del director
            $section->addText(
                strtoupper($validated['puesto_director']),
                ['size' => 12, 'color' => '969696'],
                ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 500]
            );

            // Fecha y lugar
            // Formatear fecha
            $fechaEmision = \Carbon\Carbon::parse($validated['fecha_emision'])
                ->locale('es')
                ->isoFormat('D [de] MMMM [de] YYYY');

            // Fecha y lugar
            $section->addText(
                $validated['lugar'] . ', Zac. a ' . $fechaEmision,
                ['size' => 12, 'color' => 'D4A548'],
                ['alignment' => Jc::CENTER]
            );

            /*
            |---------------------------------------------------------
            | LOGO (IZQUIERDA) + QR (DERECHA) EN LA MISMA FILA
            |---------------------------------------------------------
            */

            $tableStyle = [
                'borderSize' => 0,
                'borderColor' => 'FFFFFF',
                'cellMargin' => 0,
                'alignment'  => JcTable::CENTER,
            ];

            // Estilo de celda SIN bordes
            $cellStyle = [
                'borderSize'  => 0,
                'borderColor' => 'FFFFFF',
                'valign'      => 'center'
            ];

            $table = $section->addTable($tableStyle);
            $table->addRow(1200);

            // ===== COLUMNA IZQUIERDA (LOGO) =====
            $cellLogo = $table->addCell(5000, [
                'valign' => 'center'
            ]);

            if (file_exists(public_path('storage/ITSZO.png'))) {
                $cellLogo->addImage(public_path('storage/ITSZO.png'), [
                    'width'  => 80,
                    'height' => 80,
                    'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::LEFT
                ]);
            }

            // ===== COLUMNA DERECHA (QR) =====
            $cellQr = $table->addCell(5000, [
                'valign' => 'center'
            ]);

            if (file_exists($qrPath)) {

                $qrRun = $cellQr->addTextRun([
                    'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::RIGHT,
                    'indentation' => ['right' => 300] // espacio contra la orilla
                ]);

                $qrRun->addImage($qrPath, [
                    'width'  => 70,
                    'height' => 70,
                ]);

                $cellQr->addText(
                    'Escanea para validar',
                    ['size' => 9, 'italic' => true, 'color' => '666666'],
                    [
                        'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::RIGHT,
                        'indentation' => ['right' => 300]
                    ]
                );
            }


            /*
            |---------------------------------------------------------
            | GUARDAR Y DESCARGAR
            |---------------------------------------------------------
            */
            $fileName = 'constancia-facilitador-' . \Illuminate\Support\Str::slug($validated['nombre_completo']) . '.docx';
            $path = storage_path('app/' . $fileName);

            $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
            $objWriter->save($path);

            \Log::info('Documento guardado en: ' . $path);

            // Eliminar el QR temporal después de guardar el documento
            if (file_exists($qrPath)) {
                @unlink($qrPath);
                \Log::info('QR temporal eliminado');
            }

            // Retornar archivo para descarga
            return response()->download($path, $fileName, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ])->deleteFileAfterSend(true);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Error de validación: ' . json_encode($e->errors()));
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            \Log::error('Error generando constancia de facilitador: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            return response()->json([
                'message' => 'Error al generar la constancia',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function createDocentes($id)
    {
        $capacitacion = Constancia::with('docentes')->findOrFail($id);

        return Inertia::render('capacitaciones/DocentesForm', [
            'capacitacion' => $capacitacion,
            'docentes' => $capacitacion->docentes, 
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
                'tipo'       => 'required|in:actualizacion,formacion',
                'modalidad'        => 'required|in:presencial,virtual,mixta',
                'horas' => 'required|string',
                'fecha_inicio' => 'required|date',
                'fecha_fin' => 'required|date',
                'lugar' => 'required|string',
                'fecha_emision' => 'required|date',
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

                $hash = (string) Str::uuid();

                $constancia = Constancias::create([
                    'capacitacion_id'     => $capacitacion->id,
                    'folio'               => $capacitacion->folio_fechaemision . '-' . strtoupper(Str::random(5)),
                    'hash'                => $hash,
                    'tipo'                => 'docente',
                    'nombre_beneficiario' => $nombreCompleto,
                    'fecha_emision'       => now(),
                ]);

                // Generar QR Code
                $url = route('constancias.validar', $hash);
                $qrPath = storage_path("app/qr-{$hash}.png");

                $result = Builder::create()
                    ->writer(new PngWriter())
                    ->data($url)
                    ->size(300)
                    ->margin(10)
                    ->build();

                $result->saveToFile($qrPath);

                $phpWord = new \PhpOffice\PhpWord\PhpWord();

                // Configuración de la sección
                $section = $phpWord->addSection([
                    'marginTop'        => 850,
                    'marginBottom'     => 850,
                    'marginLeft'       => 0,
                    'marginRight'      => 0,
                    'borderTopColor'   => 'FFFFFF',
                    'borderTopSize'    => 12,
                ]);

                /*
                |---------------------------------------------------------
                | LOGOS SUPERIORES (UNO AL LADO DEL OTRO)
                |---------------------------------------------------------
                */
                $section->addTextBreak(1);
                
                // TextRun alineado a la izquierda para los logos
                $logosRun = $section->addTextRun([
                    'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::LEFT, 
                    'indentation' => ['left' => 200]
                ]);
                
                // Logo Educación
                if (file_exists(public_path('storage/educacion.png'))) {
                    $logosRun->addImage(public_path('storage/educacion.png'), [
                        'width'  => 200,
                        'height' => 60,
                    ]);
                }
                
                // Logo TecNM
                if (file_exists(public_path('storage/tecnm.png'))) {
                    $logosRun->addImage(public_path('storage/tecnm.png'), [
                        'width'  => 160,
                        'height' => 60,
                    ]);
                }
                
                // Logo Secretaría
                if (file_exists(public_path('storage/secretaria.png'))) {
                    $logosRun->addImage(public_path('storage/secretaria.png'), [
                        'width'  => 160,
                        'height' => 60,
                    ]);
                }

                /*
                |---------------------------------------------------------
                | CUERPO DEL DOCUMENTO 
                |---------------------------------------------------------
                */
                
                 $section->addTextBreak(2);
            
                // Encabezado principal
                $section->addText(
                    'EL Tecnológico Nacional de México',
                    ['size' => 18, 'bold' => true, 'color' => '969696'],
                    ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 100]
                );

                $section->addText(
                    'a través del Instituto Tecnológico Superior Zacatecas Occidente',
                    ['size' => 14, 'bold' => true, 'color' => '969696'],
                    [
                        'alignment'   => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                        'spaceAfter' => 400 // espacio debajo de este texto
                    ]
                );

                $section->addText(
                    'OTORGA LA PRESENTE:',
                    ['size' => 16, 'bold' => true, 'color' => '969696'],
                    [
                        'alignment'    => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                        'spaceBefore' => 200 // espacio arriba de este texto
                    ]
                );

                // CONSTANCIA
                $section->addText(
                    'CONSTANCIA',
                    ['size' => 50, 'bold' => true, 'color' => 'D4A548'], 
                    ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 300]
                );

                $section->addText(
                    'A',
                    ['size' => 16, 'bold' => true, 'color' => '969696'],
                    [
                        'alignment'    => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                        'spaceBefore' => 200 // espacio arriba de este texto
                    ]
                );


                // A: Nombre
                $run = $section->addTextRun([
                    'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 
                    'spaceAfter' => 400
                ]);

                $run->addText(strtoupper($nombreCompleto), [
                    'size' => 16,
                    'bold' => true,
                    'color' => '969696'
                ]);

                // Determinar tipo de curso
                $tipoCursoTexto = $validated['tipo'] === 'actualizacion'
                    ? 'Actualización'
                    : 'Formación';

                $run = $section->addTextRun([
                    'alignment' => Jc::CENTER,
                    'spaceAfter' => 150
                ]);

                $run->addText('Por haber acreditado el curso de ', ['size' => 13, 'color' => '969696']);
                $run->addText($tipoCursoTexto, ['size' => 13, 'color' => '969696']);
                $run->addText(' denominado:', ['size' => 13, 'color' => '969696']);

                $section->addText(
                    strtoupper($validated['curso']),
                    ['size' => 13, 'bold' => true, 'color' => '969696'],
                    ['alignment' => Jc::CENTER, 'spaceAfter' => 150]
                );

                $run = $section->addTextRun([
                    'alignment' => Jc::CENTER,
                    'spaceAfter' => 200
                ]);

                $run->addText(
                    "con una duración de {$validated['horas']} horas en la modalidad ",
                    ['size' => 13, 'color' => '969696']
                );

                $run->addText(
                    $validated['modalidad'],
                    ['size' => 13, 'bold' => true, 'color' => '969696']
                );

                $fechaInicio = Carbon::parse($validated['fecha_inicio'])
                    ->locale('es')
                    ->isoFormat('D [de] MMMM');

                $fechaFin = Carbon::parse($validated['fecha_fin'])
                    ->locale('es')
                    ->isoFormat('D [de] MMMM [de] YYYY');

                $section->addText(
                    "Impartido del {$fechaInicio} al {$fechaFin}.",
                    ['size' => 13, 'color' => '969696'],
                    ['alignment' => Jc::CENTER, 'spaceAfter' => 300]
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
                $nombreDirector = mb_convert_case(
                    $validated['nombre_director'],
                    MB_CASE_TITLE,
                    'UTF-8'
                );

                $section->addText(
                    $nombreDirector,
                    ['size' => 12, 'color' => '969696', 'bold' => true],
                    [
                        'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
                        'spaceAfter' => 50
                    ]
                );
                
                // Puesto del director
                $section->addText(
                    strtoupper($validated['puesto_director']),
                    ['size' => 12, 'color' => '969696'],
                    ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 500]
                );

                // Fecha y lugar
                // Formatear fecha
                $fechaEmision = \Carbon\Carbon::parse($validated['fecha_emision'])
                    ->locale('es')
                    ->isoFormat('D [de] MMMM [de] YYYY');

                // Fecha y lugar
                $section->addText(
                    $validated['lugar'] . ', Zac. a ' . $fechaEmision,
                    ['size' => 12, 'color' => 'D4A548'],
                    ['alignment' => Jc::CENTER]
                );

                /*
                |---------------------------------------------------------
                | LOGO (IZQUIERDA) + QR (DERECHA) EN LA MISMA FILA
                |---------------------------------------------------------
                */

                $tableStyle = [
                    'borderSize' => 0,
                    'borderColor' => 'FFFFFF',
                    'cellMargin' => 0,
                    'alignment'  => JcTable::CENTER,
                ];

                // Estilo de celda SIN bordes
                $cellStyle = [
                    'borderSize'  => 0,
                    'borderColor' => 'FFFFFF',
                    'valign'      => 'center'
                ];

                $table = $section->addTable($tableStyle);
                $table->addRow(1200);

                // ===== COLUMNA IZQUIERDA (LOGO) =====
                $cellLogo = $table->addCell(5000, [
                    'valign' => 'center'
                ]);

                if (file_exists(public_path('storage/ITSZO.png'))) {
                    $cellLogo->addImage(public_path('storage/ITSZO.png'), [
                        'width'  => 80,
                        'height' => 80,
                        'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::LEFT
                    ]);
                }

                // ===== COLUMNA DERECHA (QR) =====
                $cellQr = $table->addCell(5000, [
                    'valign' => 'center'
                ]);

                if (file_exists($qrPath)) {

                    $qrRun = $cellQr->addTextRun([
                        'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::RIGHT,
                        'indentation' => ['right' => 300] // espacio contra la orilla
                    ]);

                    $qrRun->addImage($qrPath, [
                        'width'  => 70,
                        'height' => 70,
                    ]);

                    $cellQr->addText(
                        'Escanea para validar',
                        ['size' => 9, 'italic' => true, 'color' => '666666'],
                        [
                            'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::RIGHT,
                            'indentation' => ['right' => 300]
                        ]
                    );
                }

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
                    $archivosTemporales[] = $qrPath; // Agregar QR a lista de archivos temporales
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

            // Limpiar archivos temporales (incluyendo QRs)
            foreach ($archivosTemporales as $file) {
                if (file_exists($file)) {
                    @unlink($file);
                    \Log::info("Archivo temporal eliminado: {$file}");
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


    public function validar($hash)
    {
        $constancia = Constancias::with('capacitacion')
            ->where('hash', $hash)
            ->first();

        return Inertia::render('capacitaciones/Validar', [
            'constancia' => $constancia
        ]);
    }

    public function buscar(Request $request)
    {
        $resultados = Constancias::with('capacitacion')
            ->whereHas('capacitacion', function ($q) use ($request) {
                $q->where('nombre', 'LIKE', "%{$request->curso}%");
            })
            ->get();

        return view('constancias.resultados', compact('resultados'));
    }

}
