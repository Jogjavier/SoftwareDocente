<?php

use App\Http\Controllers\EvaluacionDocenteController;

Route::get('/evaluaciones/docente/{id}', [EvaluacionDocenteController::class, 'dataPorDocente']);
Route::get('/evaluaciones/carrera/{id}', [EvaluacionDocenteController::class, 'dataPorCarrera']);
Route::get('/evaluaciones/general', [EvaluacionDocenteController::class, 'dataGeneral']);
