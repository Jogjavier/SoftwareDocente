import React from "react";
import { Inertia } from "@inertiajs/inertia";

export default function Index({ carreras }) {
  const handleDelete = (id) => {
    if (confirm("¿Seguro que deseas eliminar esta carrera?")) {
      Inertia.delete(`/catalogo/carreras/${id}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Listado de Carreras</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {carreras.map((carrera) => (
            <tr key={carrera.id}>
              <td className="p-2 border">{carrera.id}</td>
              <td className="p-2 border">{carrera.nombre}</td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() =>
                    Inertia.visit(`/catalogo/carreras/${carrera.id}/edit`)
                  }
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(carrera.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
