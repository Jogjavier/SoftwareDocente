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
        return Inertia::render('Catalogo/Carreras/Index', compact('carreras'));
    }

    public function create()
    {
        return Inertia::render('Catalogo/Carreras/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|unique:carreras,nombre',
            'siglas' => 'nullable|string',
        ]);

        Carrera::create($request->all());

        return redirect()->route('carreras.index');
    }

    public function edit(Carrera $carrera)
    {
        return Inertia::render('Catalogo/Carreras/Edit', compact('carrera'));
    }

    public function update(Request $request, Carrera $carrera)
    {
        $request->validate([
            'nombre' => 'required|unique:carreras,nombre,' . $carrera->id,
            'siglas' => 'nullable|string',
        ]);

        $carrera->update($request->all());

        return redirect()->route('carreras.index');
    }

    public function destroy(Carrera $carrera)
    {
        $carrera->delete();
        return redirect()->route('carreras.index');
    }
}
