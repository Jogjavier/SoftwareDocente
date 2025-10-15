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

          <div className="sm:col-span-2">
            <h3 className="text-xl font-bold text-red-800 mb-4">Niveles de Estudio</h3>
            {docente.niveles && docente.niveles.length > 0 ? (
              <div className="space-y-4">
                {docente.niveles.map((nivel, index) => (
                  <div key={index} className="border p-4 rounded-lg bg-gray-50">
                    {/* ✅ CORREGIDO: Usar los nombres correctos de los campos */}
                    <p className="text-gray-600 font-semibold">Nivel:</p>
                    <p className="text-gray-800">{nivel.nivel}</p>
                    
                    <p className="text-gray-600 font-semibold">Siglas:</p>
                    <p className="text-gray-800">{nivel.siglas}</p>
                    
                    <p className="text-gray-600 font-semibold">Nombre:</p>
                    <p className="text-gray-800">{nivel.nombre}</p>
                    
                    <p className="text-gray-600 font-semibold">Escuela de Procedencia:</p>
                    <p className="text-gray-800">{nivel.escuela_procedencia}</p>

                    <p className="text-gray-600 font-semibold">Número de Cédula:</p>
                    <p className="text-gray-800">{nivel.cedula}</p>
                    
                    {/* Mostrar archivos si existen */}
                    {nivel.titulo_path && (
                      <>
                        <p className="text-gray-600 font-semibold">Título:</p>
                        <a 
                          href={`/storage/${nivel.titulo_path}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Ver título
                        </a>
                      </>
                    )}
                    
                    {nivel.cedula_path && (
                      <>
                        <p className="text-gray-600 font-semibold">Cédula:</p>
                        <a 
                          href={`/storage/${nivel.cedula_path}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Ver cédula
                        </a>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No hay niveles de estudio disponibles.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}