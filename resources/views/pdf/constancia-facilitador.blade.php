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

        /* FRANJA DERECHA COMPLETA */
        .franja {
            position: fixed;
            top: -3cm;
            bottom: -3cm;
            right: -3cm;
            width: 3cm;
            z-index: -1;
        }

        .franja img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* LOGO INFERIOR IZQUIERDO */
        .logo-bottom-left {
            position: fixed;
            left: -3cm;
            bottom: -3cm;
            width: 4cm;
            z-index: -1;
        }

        .logo-bottom-left img {
            width: 100%;
            height: auto;
        }

        /* LOGOS SUPERIORES */
        .header {
            margin-bottom: 40px;
        }

        .logos {
            width: 100%;
            display: table;
        }

        .logo {
            display: table-cell;
            width: 33.33%;
            text-align: center;
            vertical-align: middle;
        }

        .logo img {
            height: 70px;
        }

        .container {
            width: 100%;
            text-align: center;
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

<!-- FRANJA -->
<div class="franja">
    <img src="{{ public_path('imagenes/franja_derecha.png') }}">
</div>

<!-- LOGO INFERIOR IZQUIERDO -->
<div class="logo-bottom-left">
    <img src="{{ public_path('logos/logo_inferior.png') }}">
</div>

<div class="container">

    <!-- LOGOS SUPERIORES -->
    <div class="header">
        <div class="logos">
            <div class="logo">
                <img src="{{ public_path('logos/logo1.png') }}">
            </div>
            <div class="logo">
                <img src="{{ public_path('logos/logo2.png') }}">
            </div>
            <div class="logo">
                <img src="{{ public_path('logos/logo3.png') }}">
            </div>
        </div>
    </div>

    <!-- TITULO -->
    <div class="title">
        CONSTANCIA
    </div>

    <div class="subtitle">
        OTORGA LA PRESENTE:
    </div>

    <div class="recipient">
        {{ strtoupper($nombre_completo) }}
    </div>

    <div class="content">
        Por su participación como <strong>facilitador</strong> del curso de formación denominado
    </div>

    <div class="course-name">
        “{{ strtoupper($curso) }}”
    </div>

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
