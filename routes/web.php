<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CarreraController;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\NivelEstudioController;
use App\Http\Controllers\ExperienciaDocenteController;
use App\Http\Controllers\ConstanciaController;
use App\Http\Controllers\EvaluacionDocenteController;
use App\Http\Controllers\ActivarDocenteController;
use App\Http\Controllers\EvaluacionDepartamentalController;
use App\Http\Controllers\UserController;

// Dashboard
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
})->name('home');

// Ruta pública para validar constancias (sin autenticación)
Route::get('/validar-constancia/{hash}', [ConstanciaController::class, 'validar'])
    ->name('constancias.validar');

Route::get('/buscar-constancia', [ConstanciaController::class, 'buscar'])
    ->name('constancias.buscar');

// Rutas que requieren autenticación
Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Rutas de perfil (Breeze)
    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // ========================================
    // RUTAS SOLO LECTURA (Admin y Usuario)
    // ========================================
    
    // Carreras - Solo lectura
    Route::prefix('catalogo/carreras')->name('catalogo.carreras.')->group(function () {
        Route::get('/index', [CarreraController::class, 'index'])->name('index');
    });

    // Docentes - Solo lectura (disponible para todos los autenticados)
    Route::get('/docentes/reporte-pdf', [DocenteController::class, 'generarReportePDF'])->name('docentes.reporte.pdf');
    Route::get('/docentes/index', [DocenteController::class, 'index'])->name('docentes.index');
    Route::get('/docentes/{docente}', [DocenteController::class, 'show'])->name('docentes.show');

    // Evaluación Docente - Solo lectura
    Route::prefix('evaluaciones/evaluaciondocente')->name('evaluaciones.evaluaciondocente.')->group(function () {
        Route::get('/', [EvaluacionDocenteController::class, 'index'])->name('index');
        Route::get('/por-docente', [EvaluacionDocenteController::class, 'porDocente'])->name('porDocente');
        Route::get('/por-carrera', [EvaluacionDocenteController::class, 'porCarrera'])->name('porCarrera');
        Route::get('/general', [EvaluacionDocenteController::class, 'general'])->name('general');
        Route::get('/data/docente/{id}', [EvaluacionDocenteController::class, 'dataPorDocente'])->name('data.docente');
        Route::get('/data/carrera/{carreraId}', [EvaluacionDocenteController::class, 'dataPorCarrera'])->name('data.carrera');
        Route::get('/data/general', [EvaluacionDocenteController::class, 'dataGeneral'])->name('data.general');
    });

    // Evaluación Departamental - Solo lectura
    Route::prefix('evaluaciones/evaluaciondepartamental')->name('evaluaciones.evaluaciondepartamental.')->group(function () {
        Route::get('/', [EvaluacionDepartamentalController::class, 'index'])->name('index');
        Route::get('/por-docente', [EvaluacionDepartamentalController::class, 'porDocente'])->name('porDocente');
        Route::get('/por-carrera', [EvaluacionDepartamentalController::class, 'porCarrera'])->name('porCarrera');
        Route::get('/general', [EvaluacionDepartamentalController::class, 'general'])->name('general');
        Route::get('/data/docente/{id}', [EvaluacionDepartamentalController::class, 'dataPorDocente'])->name('data.docente');
        Route::get('/data/carrera/{carreraId}', [EvaluacionDepartamentalController::class, 'dataPorCarrera'])->name('data.carrera');
        Route::get('/data/general', [EvaluacionDepartamentalController::class, 'dataGeneral'])->name('data.general');
    });

    // Capacitaciones - Solo lectura
    Route::prefix('capacitaciones')->name('capacitaciones.')->group(function () {
        Route::get('/', [ConstanciaController::class, 'index'])->name('root');
        Route::get('/index', [ConstanciaController::class, 'index'])->name('index');
        Route::get('/{constancia}', [ConstanciaController::class, 'show'])->name('show');
        Route::get('/reporte', [ConstanciaController::class, 'reportePorPeriodo'])->name('reporte');
        Route::get('/reporte/pdf', [ConstanciaController::class, 'exportarReportePDF'])->name('reporte.pdf');
    });

    // Activar Docente - Solo lectura
    Route::prefix('docentes/activardocente')->name('docentes.activardocente.')->group(function () {
        Route::get('/index', [ActivarDocenteController::class, 'index'])->name('index');
    });

    // ========================================
    // RUTAS SOLO PARA ADMINISTRADORES
    // ========================================
    
    Route::middleware(['role:admin'])->group(function () {
        
        // Carreras - CRUD completo
        Route::prefix('catalogo/carreras')->name('catalogo.carreras.')->group(function () {
            Route::get('/create', [CarreraController::class, 'create'])->name('create');
            Route::post('/', [CarreraController::class, 'store'])->name('store');
            Route::get('/{carrera}/edit', [CarreraController::class, 'edit'])->name('edit');
            Route::put('/{carrera}', [CarreraController::class, 'update'])->name('update');
            Route::delete('/{carrera}', [CarreraController::class, 'destroy'])->name('destroy');
        });

        // Docentes - CRUD completo (solo admin)
        Route::get('/docentes/create', [DocenteController::class, 'create'])->name('docentes.create');
        Route::post('/docentes', [DocenteController::class, 'store'])->name('docentes.store');
        Route::get('/docentes/{docente}/edit', [DocenteController::class, 'edit'])->name('docentes.edit');
        Route::put('/docentes/{docente}', [DocenteController::class, 'update'])->name('docentes.update');
        Route::delete('/docentes/{docente}', [DocenteController::class, 'destroy'])->name('docentes.destroy');
        Route::get('/docentes/{docente}', [DocenteController::class, 'show'])->whereNumber('docente')->name('docentes.show');

        // Niveles de estudio y experiencias
        Route::resource('docentes.niveles', NivelEstudioController::class)->shallow();
        Route::resource('docentes.experiencias', ExperienciaDocenteController::class);

        // Evaluación Docente - CRUD completo
        Route::prefix('evaluaciones/evaluaciondocente')->name('evaluaciones.evaluaciondocente.')->group(function () {
            Route::get('/create', [EvaluacionDocenteController::class, 'create'])->name('create');
            Route::post('/', [EvaluacionDocenteController::class, 'store'])->name('store');
            Route::get('/{evaluaciondocente}/edit', [EvaluacionDocenteController::class, 'edit'])->name('edit');
            Route::put('/{evaluaciondocente}', [EvaluacionDocenteController::class, 'update'])->name('update');
            Route::delete('/{evaluaciondocente}', [EvaluacionDocenteController::class, 'destroy'])->name('destroy');
        });

        // Evaluación Departamental - CRUD completo
        Route::prefix('evaluaciones/evaluaciondepartamental')->name('evaluaciones.evaluaciondepartamental.')->group(function () {
            Route::get('/create', [EvaluacionDepartamentalController::class, 'create'])->name('create');
            Route::post('/', [EvaluacionDepartamentalController::class, 'store'])->name('store');
            Route::get('/{evaluaciondepartamental}/edit', [EvaluacionDepartamentalController::class, 'edit'])->name('edit');
            Route::put('/{evaluaciondepartamental}', [EvaluacionDepartamentalController::class, ' update'])->name('update');
            Route::delete('/{evaluaciondepartamental}', [EvaluacionDepartamentalController::class, 'destroy'])->name('destroy');
        });

        // Capacitaciones - CRUD completo
        Route::prefix('capacitaciones')->name('capacitaciones.')->group(function () {
            Route::get('/create', [ConstanciaController::class, 'create'])->name('create');
            Route::post('/', [ConstanciaController::class, 'store'])->name('store');
            Route::get('/{constancia}/edit', [ConstanciaController::class, 'edit'])->name('edit');
            Route::put('/{constancia}', [ConstanciaController::class, 'update'])->name('update');
            Route::delete('/{constancia}', [ConstanciaController::class, 'destroy'])->name('destroy');
            
            // SOLO las rutas GET para mostrar los formularios
            Route::get('/{id}/constancia-facilitador', [ConstanciaController::class, 'createFacilitador'])->name('facilitador.create');
            Route::get('/{id}/constancia-docentes', [ConstanciaController::class, 'createDocentes'])->name('docentes.create');
            
            // ⚠️ RUTAS POST MOVIDAS AQUÍ DENTRO DEL GRUPO ADMIN
            Route::post('/constancia-facilitador/generar', [ConstanciaController::class, 'generateFacilitador'])
                ->withoutMiddleware([\App\Http\Middleware\HandleInertiaRequests::class])
                ->name('facilitador.generate');
            
            Route::post('/constancia-docentes/generar', [ConstanciaController::class, 'generateDocentes'])
                ->withoutMiddleware([\App\Http\Middleware\HandleInertiaRequests::class])
                ->name('docentes.generate');
        });

        // Activar Docente - CRUD completo
        Route::prefix('docentes/activardocente')->name('docentes.activardocente.')->group(function () {
            Route::get('/create', [ActivarDocenteController::class, 'create'])->name('create');
            Route::post('/', [ActivarDocenteController::class, 'store'])->name('store');
            Route::get('/{activardocente}/edit', [ActivarDocenteController::class, 'edit'])->name('edit');
            Route::put('/{activardocente}', [ActivarDocenteController::class, 'update'])->name('update');
            Route::delete('/{activardocente}', [ActivarDocenteController::class, 'destroy'])->name('destroy');
        });

        // Usuarios - CRUD completo
        Route::prefix('usuarios')->name('usuarios.')->group(function () {
            Route::get('/index', [UserController::class, 'index'])->name('index');
            Route::get('/create', [UserController::class, 'create'])->name('create');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
            Route::put('/{user}', [UserController::class, 'update'])->name('update');
            Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
            Route::get('/{user}', [UserController::class, 'show'])->name('show');
        });
    });
});

require __DIR__.'/auth.php';