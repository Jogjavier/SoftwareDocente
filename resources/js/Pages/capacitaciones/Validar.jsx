import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function Validar({ constancia = null }) {
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBuscar = (e) => {
    e.preventDefault();
    if (!busqueda) return;

    setLoading(true);
    router.get(
      route("capacitaciones.constancias.buscar"),
      { nombre: busqueda },
      { preserveState: true, onFinish: () => setLoading(false) }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4">
      {/* Logos */}
      <div className="flex items-center gap-6 mt-10">
        <img src="/images/logo-tecnm.png" alt="TecNM" className="h-16" />
        <img src="/images/logo-instituto.png" alt="Instituto" className="h-16" />
      </div>

      {/* Título */}
      <h1 className="text-2xl font-bold mt-6 text-gray-800">
        Validación de Constancias
      </h1>

      {/* Buscador */}
      <form
        onSubmit={handleBuscar}
        className="mt-6 w-full max-w-xl bg-white p-6 rounded-xl shadow"
      >
        <label className="block text-gray-700 font-semibold mb-2">
          Nombre del curso
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            placeholder="Ej. Capacitación en TIC"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </form>

      {/* Resultado */}
      {constancia && (
        <div className="mt-8 w-full max-w-xl bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold text-green-600 mb-4">
            Constancia válida ✅
          </h2>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Beneficiario:</strong>{" "}
              {constancia.nombre_beneficiario}
            </p>
            <p>
              <strong>Curso:</strong> {constancia.capacitacion.nombre}
            </p>
            <p>
              <strong>Duración:</strong>{" "}
              {constancia.capacitacion.duracion_horas} horas
            </p>
            <p>
              <strong>Fecha de emisión:</strong> {constancia.fecha_emision}
            </p>
            <p>
              <strong>Folio:</strong> {constancia.folio}
            </p>
          </div>
        </div>
      )}

      {!constancia && (
        <p className="mt-6 text-gray-500">
          Ingresa el nombre del curso o escanea el código QR.
        </p>
      )}
    </div>
  );
}
