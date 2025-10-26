import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
export default function Create() {
  const [nombre, setNombre] = useState("");
  const [siglas, setSiglas] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    Inertia.post("/catalogo/carreras", { nombre, siglas });
    console.log("Creando carrera:", { nombre, siglas });
    alert("Carrera creada exitosamente!");
    setNombre("");
    setSiglas("");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header con fondo guinda */}
      <div className="bg-red-800 rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold text-white">Dar de alta una carrera</h1>
      </div>

      {/* Formulario */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Nombre del Progarama Academico:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              placeholder="Ej: Ingeniería en Sistemas Computacionales"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Siglas:</label>
            <input
              type="text"
              value={siglas}
              onChange={(e) => setSiglas(e.target.value.toUpperCase())}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              placeholder="Ej: ISC"
              maxLength="10"
            />
          </div>
          
          <button 
            type="submit" 
            onClick={handleSubmit}
            className="w-full bg-red-800 text-yellow-400 hover:bg-red-700 hover:text-yellow-300 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}