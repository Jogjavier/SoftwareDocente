<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Constancia</title>
    <style>
        @page {
            margin: 3cm 3cm;
        }

        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.8;
            color: #000;
        }

        .franja {
            position: fixed;
            top: 0;
            bottom: 0;
            right: -3cm;
            width: 3cm;
            z-index: 0;
        }

        .franja img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .logo-bottom-left {
            position: fixed;
            left: -3cm;
            bottom: -3cm;
            width: 4cm;
            z-index: 0;
        }

        .logo-bottom-left img {
            width: 100%;
            height: auto;
        }

        .header {
            margin-bottom: 40px;
        }

        .logos {
            width: 100%;
            text-align: center;
        }

        .logo img {
            height: 70px;
        }

        .container {
            position: relative;
            z-index: 1;
        }

        .title {
            font-size: 20pt;
            font-weight: bold;
            margin-bottom: 40px;
            letter-spacing: 2px;
        }

        .subtitle {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 40px;
        }

        .recipient {
            font-size: 14pt;
            font-weight: bold;
            margin: 40px 0;
        }

        .content {
            font-size: 12pt;
            margin: 30px 0;
        }

        .course-name {
            font-weight: bold;
            font-size: 13pt;
            margin: 10px 0;
        }

        .date-place {
            margin-top: 60px;
            font-size: 12pt;
        }
    </style>
</head>
<body>

@if($franjaBase64)
<div class="franja">
    <img src="{{ $franjaBase64 }}">
</div>
@endif

@if($itszoBase64)
<div class="logo-bottom-left">
    <img src="{{ $itszoBase64 }}">
</div>
@endif

<div class="container">

    <div class="header">
        <div class="logos">
            @if($todoenunoBase64)
            <div class="logo">
                <img src="{{ $todoenunoBase64 }}" height="70">
            </div>
            @endif
        </div>
    </div>

    <div class="title">CONSTANCIA</div>
    <div class="subtitle">OTORGA LA PRESENTE:</div>

    <div class="recipient">{{ strtoupper($nombre_completo) }}</div>

    <div class="content">
        Por su participación como <strong>facilitador</strong> del curso de formación denominado
    </div>

    <div class="course-name">"{{ strtoupper($curso) }}"</div>

    <div class="content">
        Impartido del <strong>{{ $fecha_inicio_formateada }}</strong>
        al <strong>{{ $fecha_fin_formateada }}</strong>.
    </div>

    <div class="content">
        Con una duración de <strong>{{ $horas }}</strong>.
    </div>

    <div class="date-place">
        {{ $lugar }}, a {{ $fecha_expedicion }}
    </div>
</div>

</body>
</html>