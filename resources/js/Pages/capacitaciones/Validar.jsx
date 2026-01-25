import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function Validar({ constancia = null }) {
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);

   const handleBuscar = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simular búsqueda
    setTimeout(() => {
      setConstancia({
        nombre_beneficiario: "Juan Pérez García",
        capacitacion: {
          nombre: "Capacitación en Tecnologías de la Información",
          duracion_horas: 40
        },
        fecha_emision: "15 de enero de 2026",
        folio: "ITSZO-2026-001234"
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-red-800 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                  <img src="/storage/logo.webp" alt="Logo" className="h-20 rounded" />
                  <img src="/storage/ITSZO.png" alt="ITSZO" className="h-20 rounded" />
              </div>
              <h1 className="text-3xl font-bold text-white text-center flex-1">
                  Validacion de Constancias
              </h1>
          </div>
      </div>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto">
        {/* Título de Sección */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          Validación de Constancias
        </h2>

        {/* Resultado de Búsqueda */}
        {constancia ? (
          <section className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg sm:text-xl font-bold text-green-600">
                Constancia válida
              </h3>
            </div>

            <div className="space-y-3 text-sm sm:text-base">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-600">Instructor:</span>
                <span className="sm:col-span-2 text-gray-800">{constancia.nombre_beneficiario}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-600">Curso:</span>
                <span className="sm:col-span-2 text-gray-800">{constancia.capacitacion.nombre}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-600">Autoridad Educativa:</span>
                <span className="sm:col-span-2 text-gray-800">{constancia.capacitacion.autoridad_educativa}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-600">Duración:</span>
                <span className="sm:col-span-2 text-gray-800">{constancia.capacitacion.duracion_horas} horas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 py-2">
                <span className="font-semibold text-gray-600">Tipo:</span>
                <span className="sm:col-span-2 text-gray-800 font-mono">{constancia.capacitacion.tipo}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 py-2">
                <span className="font-semibold text-gray-600">Modalidad:</span>
                <span className="sm:col-span-2 text-gray-800 font-mono">{constancia.capacitacion.modalidad}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-600">Fecha de emisión:</span>
                <span className="sm:col-span-2 text-gray-800">{constancia.capacitacion.folio_fechaemision}</span>
              </div>
            </div>
          </section>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-sm sm:text-base">
              Ingresa el nombre del curso o escanea el código QR para validar la constancia
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
