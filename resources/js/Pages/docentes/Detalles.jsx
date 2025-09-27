import React from "react";
import { Inertia } from "@inertiajs/inertia";

export default function Detalles({ docente }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-red-800 rounded-xl p-6 mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Detalles del Docente</h1>
        <button
          onClick={() => Inertia.visit("/docentes/index")}
          className="bg-yellow-400 text-red-800 px-4 py-2 rounded font-semibold hover:bg-yellow-300"
        >
          Regresar
        </button>
      </div>

      {/* Tarjeta con detalles */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-red-800 mb-6">
          {docente.nombres} {docente.apellido_paterno} {docente.apellido_materno}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 font-semibold">Fecha de Nacimiento:</p>
            <p className="text-gray-800">{docente.fecha_nacimiento}</p>
          </div>

          <div>
            <p className="text-gray-600 font-semibold">Sexo:</p>
            <p className="text-gray-800">{docente.sexo}</p>
          </div>

          <div>
            <p className="text-gray-600 font-semibold">RFC:</p>
            <p className="text-gray-800">{docente.rfc}</p>
          </div>

          <div>
            <p className="text-gray-600 font-semibold">CURP:</p>
            <p className="text-gray-800">{docente.curp}</p>
          </div>

          <div>
            <p className="text-gray-600 font-semibold">Correo Electrónico:</p>
            <p className="text-gray-800">{docente.email}</p>
          </div>

          <div>
            <p className="text-gray-600 font-semibold">Teléfono:</p>
            <p className="text-gray-800">{docente.telefono}</p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-gray-600 font-semibold">Nivel de Inglés:</p>
            <p className="text-gray-800">{docente.nivel_ingles}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
