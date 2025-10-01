import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function Index({ docentes = [], filters = {} }) {
  const [search, setSearch] = useState(filters.search || "");

  const handleDelete = (id) => {
    if (confirm("¿Seguro que deseas eliminar este docente?")) {
      Inertia.delete(`/docentes/${id}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    Inertia.get("/docentes/index", { search });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="bg-red-800 rounded-xl p-6 mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Listado de Docentes</h1>
        <button
          onClick={() => Inertia.visit("/")}
          className="bg-yellow-400 text-red-800 px-4 py-2 rounded font-semibold hover:bg-yellow-300"
        >
          Inicio
        </button>
      </div>

      {/* Barra de búsqueda */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o apellido"
          className="border border-gray-300 p-2 rounded w-80"
        />
        <button
          type="submit"
          className="bg-red-800 text-yellow-400 px-4 py-2 rounded hover:bg-red-700"
        >
          Buscar
        </button>
      </form>

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
                      {/* ✅ SOLO UN BOTÓN DE DETALLES */}
                      <button
                        onClick={() => Inertia.visit(`/docentes/${docente.id}`)}
                        className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 rounded"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => Inertia.visit(`/docentes/${docente.id}/edit`)}
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