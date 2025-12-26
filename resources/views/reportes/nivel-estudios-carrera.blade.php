<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte de Nivel de Estudios por Carrera</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 3px solid #991b1b;
            padding-bottom: 15px;
        }
        .header h1 {
            color: #991b1b;
            margin: 5px 0;
            font-size: 16px;
        }
        .header h2 {
            color: #333;
            margin: 5px 0;
            font-size: 14px;
        }
        .header .fecha {
            color: #666;
            font-size: 9px;
        }
        .carrera-section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        .carrera-title {
            background-color: #991b1b;
            color: white;
            padding: 8px;
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .nivel-subtitle {
            background-color: #dc2626;
            color: white;
            padding: 6px 8px;
            font-size: 11px;
            font-weight: bold;
            margin-top: 10px;
            margin-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        table th {
            background-color: #f3f4f6;
            padding: 6px;
            text-align: left;
            border: 1px solid #ddd;
            font-weight: bold;
            font-size: 10px;
        }
        table td {
            padding: 6px;
            border: 1px solid #ddd;
            font-size: 10px;
        }
        .total-row {
            font-weight: bold;
            background-color: #fef3c7;
        }
        .resumen-box {
            background-color: #f9fafb;
            border: 2px solid #991b1b;
            padding: 10px;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        .resumen-box h3 {
            margin: 0 0 8px 0;
            color: #991b1b;
            font-size: 12px;
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 9px;
            color: #666;
            padding: 10px 0;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Instituto Tecnológico Superior de Zacatecas Occidente</h1>
        <h2>Reporte de Nivel de Estudios por Carrera</h2>
        <p class="fecha">Generado el: {{ $fecha }}</p>
    </div>

    @forelse($reporteAgrupado as $carrera => $niveles)
    <div class="carrera-section">
        <div class="carrera-title">{{ $carrera }}</div>
        
        @php $totalCarrera = 0; @endphp
        
        @foreach($niveles as $nivel => $docentes)
        <div class="nivel-subtitle">{{ $nivel }} ({{ count($docentes) }} docente{{ count($docentes) != 1 ? 's' : '' }})</div>
        
        <table>
            <thead>
                <tr>
                    <th style="width: 10%;">No.</th>
                    <th style="width: 55%;">Nombre Completo</th>
                    <th style="width: 15%; text-align: center;">Sexo</th>
                    <th style="width: 20%;">Nivel</th>
                </tr>
            </thead>
            <tbody>
                @foreach($docentes as $index => $docente)
                <tr>
                    <td style="text-align: center;">{{ $index + 1 }}</td>
                    <td>{{ $docente->apellido_paterno }} {{ $docente->apellido_materno }} {{ $docente->nombres }}</td>
                    <td style="text-align: center;">{{ strtoupper($docente->sexo) }}</td>
                    <td>{{ $docente->nivel }}</td>
                </tr>
                @php $totalCarrera++; @endphp
                @endforeach
            </tbody>
        </table>
        @endforeach
        
        <div class="resumen-box">
            <h3>Resumen de {{ $carrera }}</h3>
            <p><strong>Total de docentes:</strong> {{ $totalCarrera }}</p>
            <p><strong>Niveles de estudio:</strong> {{ count($niveles) }}</p>
        </div>
    </div>
    @empty
    <p style="text-align: center; padding: 20px;">No hay datos disponibles para el reporte</p>
    @endforelse

    <div class="footer">
        <p>Sistema de Gestión de Docentes - ITSZO</p>
    </div>
</body>
</html>