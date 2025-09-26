import React from "react";
import { Inertia } from "@inertiajs/inertia";

export default function Index({ carreras = [] }) {
  const handleDelete = (id) => {
    if (confirm("¿Seguro que deseas eliminar esta carrera?")) {
      Inertia.delete(`/catalogo/carreras/${id}`);
      console.log("Eliminando carrera con ID:", id);
    }
  };

  const handleEdit = (id) => {
    Inertia.visit(`/catalogo/carreras/${id}/edit`);
    console.log("Editando carrera con ID:", id);
  };

  const handleGoBack = () => {
    Inertia.visit("/"); // Ajusta la ruta si tu Dashboard está en otra URL
  };

  // Datos de ejemplo si no hay carreras
  const carrerasData = carreras.length > 0 ? carreras : [];

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Botón para regresar */}
      <div className="mb-4 flex justify-start">
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-yellow-400 text-red-800 font-semibold rounded hover:bg-yellow-300 transition-colors duration-200 shadow"
        >
          ← Regresar a pantalla de inicio 
        </button>
      </div>

      {/* Header con fondo guinda */}
      <div className="bg-red-800 rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold text-white">Listado de Carreras</h1>
      </div>

      {/* Contenedor de la tabla */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-red-800">
              <th className="p-3 text-left text-white font-semibold border-r border-red-700">ID</th>
              <th className="p-3 text-left text-white font-semibold border-r border-red-700">Nombre</th>
              <th className="p-3 text-left text-white font-semibold border-r border-red-700">Siglas</th>
              <th className="p-3 text-center text-white font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carrerasData.map((carrera, index) => (
              <tr key={carrera.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="p-3 border-r border-gray-200 text-gray-800">{carrera.id}</td>
                <td className="p-3 border-r border-gray-200 text-gray-800">{carrera.nombre}</td>
                <td className="p-3 border-r border-gray-200 text-gray-800">{carrera.siglas}</td>
                <td className="p-3 border-gray-200">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(carrera.id)}
                      className="px-4 py-2 bg-red-800 text-yellow-400 hover:bg-red-700 hover:text-yellow-300 rounded transition-colors duration-200 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(carrera.id)}
                      className="px-4 py-2 bg-red-800 text-yellow-400 hover:bg-red-900 hover:text-yellow-300 rounded transition-colors duration-200 font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
