import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function Index({ docentes = [], filters = {} }) {
  const [search, setSearch] = useState(filters.search || "");

  const handleDelete = (id) => {
    if (confirm("¿Seguro que deseas eliminar este docente?")) {
      router.delete(`/docentes/${id}`);  // Cambiar Inertia por router
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.get("/docentes/index", { search });  // Cambiar Inertia por router
  };

  const generarReportePDF = () => {
    window.open('/docentes/reporte-pdf', '_blank');
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="bg-red-800 rounded-xl p-6 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img 
            src="/storage/logo.webp" 
            alt="Logo" 
            className="h-20 w-37 object-cover rounded"
          />
          <img 
            src="/storage/ITSZO.webp" 
            alt="Logo 2" 
            className="h-20 w-37 object-cover rounded"
          />
        </div>
        <h1 className="text-3xl font-bold text-white">Listado de Docentes</h1>
        <button
          onClick={() => router.visit("/")}
          className="bg-yellow-400 text-white px-4 py-2 rounded font-semibold hover:bg-yellow-300"
        >
          Inicio
        </button>
      </div>

       {/* Barra de búsqueda y botón de reporte */}
      <div className="mb-4 flex justify-between items-center gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o apellido"
            className="border border-gray-300 p-2 rounded w-80"
          />
          <button
            type="submit"
            className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Buscar
          </button>
        </form>

        <button
          onClick={generarReportePDF}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          Generar Reporte por Carrera (PDF)
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-red-800 text-white">
              <th className="p-3 border-r border-red-700 text-left">Nombre(s)</th>
              <th className="p-3 border-r border-red-700 text-left">Apellido Paterno</th>
              <th className="p-3 border-r border-red-700 text-left">Apellido Materno</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {docentes.length > 0 ? (
              docentes.map((docente, index) => (
                <tr
                  key={docente.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="p-3 border-r border-gray-200 text-gray-800">
                    {docente.nombres}
                  </td>
                  <td className="p-3 border-r border-gray-200 text-gray-800">
                    {docente.apellido_paterno}
                  </td>
                  <td className="p-3 border-r border-gray-200 text-gray-800">
                    {docente.apellido_materno}
                  </td>
                  <td className="p-3 border-gray-200">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => router.visit(`/docentes/${docente.id}`)}
                        className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 rounded"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => router.visit(`/docentes/${docente.id}/edit`)}
                        className="px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-400 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(docente.id)}
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-500 rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No se encontraron docentes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}