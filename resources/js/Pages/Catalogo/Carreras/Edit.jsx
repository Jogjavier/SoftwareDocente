import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function Edit({ carrera }) {
  const [nombre, setNombre] = useState(carrera.nombre);
  const [siglas, setSiglas] = useState(carrera.siglas);

  const handleSubmit = (e) => {
    e.preventDefault();
    Inertia.put(`/catalogo/carreras/${carrera.id}`, { nombre, siglas });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Carrera</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Siglas</label>
          <input
            type="text"
            value={siglas}
            onChange={(e) => setSiglas(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Actualizar
        </button>
      </form>
    </div>
  );
}
