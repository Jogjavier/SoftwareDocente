<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Cursos - {{ $anio }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            color: #333;
            padding: 20px;
        }

        .portada {
            text-align: center;
            margin-bottom: 50px;
            padding: 40px;
            border: 3px solid #2c3e50;
        }

        .portada h1 {
            font-size: 24pt;
            color: #2c3e50;
            margin-bottom: 20px;
        }

        .portada h2 {
            font-size: 18pt;
            color: #34495e;
            margin-bottom: 30px;
        }

        .portada p {
            font-size: 12pt;
            color: #7f8c8d;
        }

        .header-periodo {
            text-align: center;
            margin-bottom: 30px;
            margin-top: 30px;
            border: 3px solid #8e44ad;
            padding: 20px;
            background-color: #f4ecf7;
        }

        .header-periodo h1 {
            font-size: 20pt;
            color: #8e44ad;
            margin-bottom: 5px;
        }

        .seccion-tipo {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }

        .seccion-header {
            background-color: #3498db;
            color: white;
            padding: 12px;
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
        }

        .seccion-header.formacion {
            background-color: #2ecc71;
        }

        .curso {
            border: 1px solid #ddd;
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            page-break-inside: avoid;
        }

        .curso-titulo {
            font-size: 12pt;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 5px;
        }

        .curso-info {
            display: table;
            width: 100%;
            margin-bottom: 10px;
        }

        .info-row {
            display: table-row;
        }

        .info-label {
            display: table-cell;
            font-weight: bold;
            width: 35%;
            padding: 5px;
            color: #555;
        }

        .info-value {
            display: table-cell;
            padding: 5px;
            color: #333;
        }

        .docentes-section {
            margin-top: 15px;
            background-color: white;
            padding: 10px;
            border-left: 4px solid #3498db;
        }

        .docentes-titulo {
            font-weight: bold;
            font-size: 11pt;
            margin-bottom: 8px;
            color: #2c3e50;
        }

        .docentes-lista {
            display: table;
            width: 100%;
        }

        .docente-item {
            display: table-row;
        }

        .docente-numero {
            display: table-cell;
            width: 30px;
            padding: 3px 5px;
            color: #7f8c8d;
        }

        .docente-nombre {
            display: table-cell;
            padding: 3px 5px;
        }

        .estadisticas {
            background-color: #ecf0f1;
            padding: 15px;
            margin-top: 20px;
            margin-bottom: 30px;
            border-radius: 5px;
            page-break-inside: avoid;
        }

        .estadisticas h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 12pt;
            text-align: center;
        }

        .stats-grid {
            display: table;
            width: 100%;
        }

        .stat-item {
            display: table-cell;
            text-align: center;
            padding: 10px;
            background-color: white;
            margin: 5px;
            border-radius: 3px;
        }

        .stat-value {
            font-size: 18pt;
            font-weight: bold;
            color: #3498db;
        }

        .stat-label {
            font-size: 9pt;
            color: #7f8c8d;
            margin-top: 5px;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 9pt;
            color: #7f8c8d;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }

        .no-data {
            text-align: center;
            padding: 30px;
            color: #7f8c8d;
            font-style: italic;
            background-color: #f9f9f9;
            border: 1px dashed #ddd;
        }

        .page-break {
            page-break-after: always;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        table th {
            background-color: #8e44ad;
            color: white;
            padding: 10px;
            text-align: left;
            border: 1px solid #7d3c98;
        }

        table td {
            padding: 10px;
            border: 1px solid #ddd;
        }

        .resumen-periodo {
            background-color: #f4ecf7;
            border: 2px solid #8e44ad;
            padding: 20px;
            margin-top: 30px;
            margin-bottom: 30px;
            page-break-inside: avoid;
        }

        .resumen-periodo h3 {
            text-align: center;
            color: #8e44ad;
            font-size: 14pt;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <!-- PORTADA -->
    <div class="portada">
        <h1>REPORTE DE CAPACITACIÓN DOCENTE</h1>
        <h2>{{ $tituloReporte ?? "Año {$anio}" }}</h2>
        <p style="margin-top: 20px;">Instituto Tecnológico Superior Zacatecas Occidente</p>
        <p style="margin-top: 40px;">Fecha de generación: {{ now()->format('d/m/Y H:i') }}</p>
    </div>

    <div class="page-break"></div>

    @php
        $totalCursosGeneral = 0;
        $totalDocentesGeneral = collect();
        $totalParticipacionesGeneral = 0;
        $totalHorasGeneral = 0;
    @endphp

    <!-- ITERAR POR CADA PERIODO -->
    @foreach($reportesPorPeriodo as $index => $reporte)
        @php
            $reporteFormacion = $reporte['formacion'];
            $reporteActualizacion = $reporte['actualizacion'];
            $periodo = $reporte['periodo'];
            $anioReporte = $reporte['anio'];
            $totalCursosPeriodo = $reporteFormacion->count() + $reporteActualizacion->count();
            
            // Acumular totales generales
            $totalCursosGeneral += $totalCursosPeriodo;
            $totalDocentesGeneral = $totalDocentesGeneral->merge(
                $reporteFormacion->pluck('docentes')->flatten()
            )->merge(
                $reporteActualizacion->pluck('docentes')->flatten()
            );
            $totalParticipacionesGeneral += $reporteFormacion->pluck('docentes')->flatten()->count() + $reporteActualizacion->pluck('docentes')->flatten()->count();
            $totalHorasGeneral += $reporteFormacion->sum('duracion_horas') + $reporteActualizacion->sum('duracion_horas');
        @endphp

        <!-- ENCABEZADO DEL PERIODO -->
        <div class="header-periodo">
            <h1>{{ $periodo }} {{ $anioReporte }}</h1>
        </div>

        <!-- CURSOS DE FORMACIÓN -->
        <div class="seccion-tipo">
            <div class="seccion-header formacion">
                CURSOS DE FORMACIÓN - {{ $periodo }} {{ $anioReporte }}
            </div>

            @if($reporteFormacion->count() > 0)
                @foreach($reporteFormacion as $curso)
                    <div class="curso">
                        <div class="curso-titulo">{{ $curso->nombre }}</div>
                        
                        <div class="curso-info">
                            <div class="info-row">
                                <div class="info-label">Instructor:</div>
                                <div class="info-value">{{ $curso->instructor }}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Autoridad Educativa:</div>
                                <div class="info-value">{{ $curso->autoridad_educativa }}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Duración:</div>
                                <div class="info-value">{{ $curso->duracion_horas }} horas</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Fechas:</div>
                                <div class="info-value">
                                    @if($curso->fecha_inicio && $curso->fecha_fin)
                                        {{ \Carbon\Carbon::parse($curso->fecha_inicio)->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($curso->fecha_fin)->format('d/m/Y') }}
                                    @else
                                        No especificado
                                    @endif
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Modalidad:</div>
                                <div class="info-value">{{ ucfirst($curso->modalidad) }}</div>
                            </div>
                            @if($curso->folio_fechaemision)
                            <div class="info-row">
                                <div class="info-label">Folio/Fecha Emisión:</div>
                                <div class="info-value">{{ $curso->folio_fechaemision }}</div>
                            </div>
                            @endif
                            <div class="info-row">
                                <div class="info-label">Docentes Participantes:</div>
                                <div class="info-value" style="font-weight: bold; color: #2ecc71; font-size: 12pt;">{{ $curso->docentes->count() }} docentes</div>
                            </div>
                        </div>

                        @if($curso->docentes && $curso->docentes->count() > 0)
                            <div class="docentes-section" style="border-left: 4px solid #2ecc71;">
                                <div class="docentes-titulo">
                                    Lista de Docentes Participantes
                                </div>
                                <div class="docentes-lista">
                                    @foreach($curso->docentes as $idx => $docente)
                                        <div class="docente-item">
                                            <div class="docente-numero">{{ $idx + 1 }}.</div>
                                            <div class="docente-nombre">
                                                {{ $docente->nombres }} {{ $docente->apellido_paterno }} {{ $docente->apellido_materno }}
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        @endif
                    </div>
                @endforeach

                <!-- Estadísticas de Formación -->
                <div class="estadisticas" style="background-color: #e8f8f5; border: 2px solid #2ecc71;">
                    <h3 style="color: #2ecc71;">Resumen - Cursos de Formación</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value" style="color: #2ecc71;">{{ $reporteFormacion->count() }}</div>
                            <div class="stat-label">Total de Cursos</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" style="color: #2ecc71;">{{ $reporteFormacion->pluck('docentes')->flatten()->unique('id')->count() }}</div>
                            <div class="stat-label">Docentes Únicos</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" style="color: #2ecc71;">{{ $reporteFormacion->pluck('docentes')->flatten()->count() }}</div>
                            <div class="stat-label">Total Participaciones</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" style="color: #2ecc71;">{{ $reporteFormacion->sum('duracion_horas') }}</div>
                            <div class="stat-label">Total de Horas</div>
                        </div>
                    </div>
                </div>
            @else
                <div class="no-data">No hay cursos de formación registrados en {{ $periodo }} {{ $anioReporte }}</div>
            @endif
        </div>

        <!-- CURSOS DE ACTUALIZACIÓN -->
        <div class="seccion-tipo">
            <div class="seccion-header">
                CURSOS DE ACTUALIZACIÓN - {{ $periodo }} {{ $anioReporte }}
            </div>

            @if($reporteActualizacion->count() > 0)
                @foreach($reporteActualizacion as $curso)
                    <div class="curso">
                        <div class="curso-titulo">{{ $curso->nombre }}</div>
                        
                        <div class="curso-info">
                            <div class="info-row">
                                <div class="info-label">Instructor:</div>
                                <div class="info-value">{{ $curso->instructor }}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Autoridad Educativa:</div>
                                <div class="info-value">{{ $curso->autoridad_educativa }}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Duración:</div>
                                <div class="info-value">{{ $curso->duracion_horas }} horas</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Fechas:</div>
                                <div class="info-value">
                                    @if($curso->fecha_inicio && $curso->fecha_fin)
                                        {{ \Carbon\Carbon::parse($curso->fecha_inicio)->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($curso->fecha_fin)->format('d/m/Y') }}
                                    @else
                                        No especificado
                                    @endif
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Modalidad:</div>
                                <div class="info-value">{{ ucfirst($curso->modalidad) }}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Docentes Participantes:</div>
                                <div class="info-value" style="font-weight: bold; color: #3498db; font-size: 12pt;">{{ $curso->docentes->count() }} docentes</div>
                            </div>
                        </div>

                        @if($curso->docentes && $curso->docentes->count() > 0)
                            <div class="docentes-section">
                                <div class="docentes-titulo">
                                    Lista de Docentes Participantes
                                </div>
                                <div class="docentes-lista">
                                    @foreach($curso->docentes as $idx => $docente)
                                        <div class="docente-item">
                                            <div class="docente-numero">{{ $idx + 1 }}.</div>
                                            <div class="docente-nombre">
                                                {{ $docente->nombres }} {{ $docente->apellido_paterno }} {{ $docente->apellido_materno }}
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        @endif
                    </div>
                @endforeach

                <!-- Estadísticas de Actualización -->
                <div class="estadisticas" style="background-color: #ebf5fb; border: 2px solid #3498db;">
                    <h3 style="color: #3498db;">Resumen - Cursos de Actualización</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value">{{ $reporteActualizacion->count() }}</div>
                            <div class="stat-label">Total de Cursos</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">{{ $reporteActualizacion->pluck('docentes')->flatten()->unique('id')->count() }}</div>
                            <div class="stat-label">Docentes Únicos</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">{{ $reporteActualizacion->pluck('docentes')->flatten()->count() }}</div>
                            <div class="stat-label">Total Participaciones</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">{{ $reporteActualizacion->sum('duracion_horas') }}</div>
                            <div class="stat-label">Total de Horas</div>
                        </div>
                    </div>
                </div>
            @else
                <div class="no-data">No hay cursos de actualización registrados en {{ $periodo }} {{ $anioReporte }}</div>
            @endif
        </div>

        <!-- RESUMEN DEL PERIODO -->
        @php
            $totalDocentesPeriodo = $reporteFormacion->pluck('docentes')->merge($reporteActualizacion->pluck('docentes'))->flatten()->unique('id')->count();
            $totalParticipacionesPeriodo = $reporteFormacion->pluck('docentes')->flatten()->count() + $reporteActualizacion->pluck('docentes')->flatten()->count();
            $totalHorasPeriodo = $reporteFormacion->sum('duracion_horas') + $reporteActualizacion->sum('duracion_horas');
        @endphp

        @if($totalCursosPeriodo > 0)
        <div class="resumen-periodo">
            <h3>RESUMEN CONSOLIDADO {{ $periodo }} {{ $anioReporte }}</h3>
            
            <table>
                <thead>
                    <tr>
                        <th>Indicador</th>
                        <th style="text-align: center;">Formación</th>
                        <th style="text-align: center;">Actualización</th>
                        <th style="text-align: center;">Total Periodo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background-color: white;">
                        <td style="font-weight: bold;">Cursos Impartidos</td>
                        <td style="text-align: center; font-size: 14pt; color: #2ecc71;">{{ $reporteFormacion->count() }}</td>
                        <td style="text-align: center; font-size: 14pt; color: #3498db;">{{ $reporteActualizacion->count() }}</td>
                        <td style="text-align: center; font-size: 14pt; font-weight: bold; color: #8e44ad;">{{ $totalCursosPeriodo }}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="font-weight: bold;">Docentes Participantes Únicos</td>
                        <td style="text-align: center; font-size: 14pt; color: #2ecc71;">{{ $reporteFormacion->pluck('docentes')->flatten()->unique('id')->count() }}</td>
                        <td style="text-align: center; font-size: 14pt; color: #3498db;">{{ $reporteActualizacion->pluck('docentes')->flatten()->unique('id')->count() }}</td>
                        <td style="text-align: center; font-size: 14pt; font-weight: bold; color: #8e44ad;">{{ $totalDocentesPeriodo }}</td>
                    </tr>
                    <tr style="background-color: white;">
                        <td style="font-weight: bold;">Total de Participaciones</td>
                        <td style="text-align: center; font-size: 14pt; color: #2ecc71;">{{ $reporteFormacion->pluck('docentes')->flatten()->count() }}</td>
                        <td style="text-align: center; font-size: 14pt; color: #3498db;">{{ $reporteActualizacion->pluck('docentes')->flatten()->count() }}</td>
                        <td style="text-align: center; font-size: 14pt; font-weight: bold; color: #8e44ad;">{{ $totalParticipacionesPeriodo }}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="font-weight: bold;">Total de Horas</td>
                        <td style="text-align: center; font-size: 14pt; color: #2ecc71;">{{ $reporteFormacion->sum('duracion_horas') }}</td>
                        <td style="text-align: center; font-size: 14pt; color: #3498db;">{{ $reporteActualizacion->sum('duracion_horas') }}</td>
                        <td style="text-align: center; font-size: 14pt; font-weight: bold; color: #8e44ad;">{{ $totalHorasPeriodo }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        @endif

        @if($index < count($reportesPorPeriodo) - 1)
            <div class="page-break"></div>
        @endif
    @endforeach

    <div class="footer">
        <p>Sistema de Gestión de Capacitaciones Docentes</p>
        <p>Instituto Tecnológico Superior Zacatecas Occidente</p>
        <p>Generado automáticamente el {{ now()->format('d/m/Y') }} a las {{ now()->format('H:i') }}</p>
    </div>
</body>
</html>