<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <style>
        body { font-family: DejaVu Sans, sans-serif; }
        h1 { text-align: center; }
    </style>
</head>
<body>
    <h1>CONSTANCIA</h1>

    <p><strong>Nombre:</strong> {{ $constancia->nombre_completo }}</p>
    <p><strong>CURP:</strong> {{ $constancia->curp }}</p>
    <p><strong>Centro de Adscripción:</strong> {{ $constancia->centro_adscripcion }}</p>
    <p><strong>Periodo:</strong> {{ $constancia->periodo_inicio }} - {{ $constancia->periodo_fin }}</p>
    <p><strong>Curso:</strong> {{ $constancia->nombre_curso }}</p>
    <p><strong>Modalidad:</strong> {{ $constancia->modalidad }}</p>
    <p><strong>Horas:</strong> {{ $constancia->horas }}</p>
    <p><strong>Folio:</strong> {{ $constancia->folio }}</p>
    <p><strong>Fecha de Emisión:</strong> {{ $constancia->fecha_emision }}</p>
    <p><strong>Autoridad Educativa:</strong> {{ $constancia->autoridad_educativa }}</p>
</body>
</html>
