<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CarreraController;
use App\Http\Controllers\DocenteController;

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