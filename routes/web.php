<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CarreraController;

Route::get('/', function () {
    return Inertia::render('Dashboard');
});

Route::get('/dashboard', function () {
    return Inertia\Inertia::render('Dashboard');
});

Route::get('/catalogo/carreras', [CarreraController::class, 'index'])->name('carreras.index');
Route::get('/catalogo/carreras/create', [CarreraController::class, 'create'])->name('carreras.create');
Route::post('/catalogo/carreras', [CarreraController::class, 'store'])->name('carreras.store');
Route::get('/catalogo/carreras/{carrera}/edit', [CarreraController::class, 'edit'])->name('carreras.edit');
Route::put('/catalogo/carreras/{carrera}', [CarreraController::class, 'update'])->name('carreras.update');
Route::delete('/catalogo/carreras/{carrera}', [CarreraController::class, 'destroy'])->name('carreras.destroy');

