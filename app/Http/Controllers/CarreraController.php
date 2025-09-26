<?php

namespace App\Http\Controllers;

use App\Models\Carrera;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CarreraController extends Controller
{
    public function index()
    {
        $carreras = Carrera::all();
        return Inertia::render('catalogo/carreras/index', [
        'carreras' => $carreras
        ]);
    }

    public function create()
    {
        return Inertia::render('catalogo/carreras/create');
    }

    public function store(Request $request)
    {
        $request->validate([
        'nombre' => 'required|string|max:255|unique:carreras,nombre',
        'siglas' => 'nullable|string|max:255|unique:carreras,siglas',
        ]);

    Carrera::create([
        'nombre' => $request->nombre,
        'siglas' => $request->siglas,
        ]);

     return redirect()->route('carreras.index');
    }

    public function edit(Carrera $carrera)
    {
        return Inertia::render('catalogo/carreras/edit', [
        'carrera' => $carrera,
        ]);
    }

    public function update(Request $request, Carrera $carrera)
    {
       $request->validate([
        'nombre' => 'required|string|max:255|unique:carreras,nombre,' . $carrera->id,
        'siglas' => 'nullable|string|max:255',
        ]);

        $carrera->update([
            'nombre' => $request->nombre,
            'siglas' => $request->siglas,
        ]);

        return redirect()->route('carreras.index');
    }

    public function destroy(Carrera $carrera)
    {
        $carrera->delete();
        return redirect()->route('carreras.index');
    }
}
