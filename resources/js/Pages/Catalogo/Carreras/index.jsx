import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function Index({ carreras = [], filters = {} }) {
  const [search, setSearch] = useState(filters.search || "");

  const handleDelete = (id) => {
    if (confirm("¿Seguro que deseas eliminar esta carrera?")) {
      Inertia.delete(`/catalogo/carreras/${id}`);
    }
  };

  const handleEdit = (id) => {
    Inertia.visit(`/catalogo/carreras/${id}/edit`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    Inertia.get("/catalogo/carreras/index", { search });
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

      <h1 className="text-3xl font-bold text-white">
        Listado de Carreras
      </h1>

      <button
        onClick={() => router.visit("/")}
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
          placeholder="Buscar por nombre o siglas..."
          className="border border-gray-300 p-2 rounded w-80"
        />
        <button
          type="submit"
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Buscar
        </button>
      </form>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-red-800">
              <th className="p-3 text-left text-white font-semibold border-r border-red-700">ID</th>
              <th className="p-3 text-left text-white font-semibold border-r border-red-700">Nombre del Programa Academico</th>
              <th className="p-3 text-left text-white font-semibold border-r border-red-700">Siglas</th>
              <th className="p-3 text-center text-white font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carreras.length > 0 ? (
              carreras.map((carrera, index) => (
                <tr key={carrera.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-3 border-r border-gray-200 text-gray-800">{carrera.id}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-800">{carrera.nombre}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-800">{carrera.siglas}</td>
                  <td className="p-3 border-gray-200">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(carrera.id)}
                        className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(carrera.id)}
                        className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
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
                  No se encontraron carreras
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
