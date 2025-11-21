<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CarreraController;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\NivelEstudioController;
use App\Http\Controllers\ExperienciaDocenteController;
use App\Http\Controllers\CursoInternoController;
use App\Http\Controllers\CursoExternoController;
use App\Http\Controllers\ConstanciaController;

Route::get('/', function () {
    return Inertia::render('Dashboard');
});

Route::get('/dashboard', function () {
    return Inertia\Inertia::render('Dashboard');
});

// Carreras
Route::prefix('catalogo/carreras')->name('carreras.')->group(function () {
    Route::get('/index', [CarreraController::class, 'index'])->name('index');
    Route::get('/create', [CarreraController::class, 'create'])->name('create');
    Route::post('/', [CarreraController::class, 'store'])->name('store');
    Route::get('/{carrera}/edit', [CarreraController::class, 'edit'])->name('edit');
    Route::put('/{carrera}', [CarreraController::class, 'update'])->name('update');
    Route::delete('/{carrera}', [CarreraController::class, 'destroy'])->name('destroy');
});

// Docentes
Route::prefix('docentes')->name('docentes.')->group(function () {
    Route::get('/create', [DocenteController::class, 'create'])->name('create');
    Route::post('/', [DocenteController::class, 'store'])->name('store');
    Route::get('/index', [DocenteController::class, 'index'])->name('index');
    Route::get('/{docente}', [DocenteController::class, 'show'])->name('show');
    Route::get('/{docente}/edit', [DocenteController::class, 'edit'])->name('edit');
    Route::put('/{docente}', [DocenteController::class, 'update'])->name('update');
    Route::delete('/{docente}', [DocenteController::class, 'destroy'])->name('destroy');
});
Route::resource('docentes.niveles', NivelEstudioController::class)->shallow();
Route::resource('docentes.experiencias', ExperienciaDocenteController::class);
Route::resource('capacitaciones/cursointerno', CursoInternoController::class);
Route::resource('capacitaciones/cursoexterno', CursoExternoController::class);

Route::prefix('capacitaciones/constancia')->name('capacitaciones.constancia.')->group(function () {
    Route::get('/index', [ConstanciaController::class, 'index'])->name('index');
    Route::get('/create', [ConstanciaController::class, 'create'])->name('create');
    Route::post('/', [ConstanciaController::class, 'store'])->name('store');
    Route::get('/{constancia}/edit', [ConstanciaController::class, 'edit'])->name('edit');
    Route::put('/{constancia}', [ConstanciaController::class, 'update'])->name('update');
    Route::delete('/{constancia}', [ConstanciaController::class, 'destroy'])->name('destroy');
});
