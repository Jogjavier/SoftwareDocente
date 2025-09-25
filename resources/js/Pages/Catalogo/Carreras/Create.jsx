import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function Create() {
  const [nombre, setNombre] = useState("");
  const [siglas, setSiglas] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    Inertia.post("/catalogo/carreras", { nombre, siglas });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dar de alta Carrera</h1>
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
