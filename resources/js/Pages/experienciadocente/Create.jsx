import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/inertia-react";

export default function Create({ docente, carreras }) {
  const [formData, setFormData] = useState({
    anio_ingreso: "",
    carrera_id: "",
    horas_nombramiento: "",
    presidente_academia: false,
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Usar ruta directa en lugar de route()
    Inertia.post(`/docentes/${docente.id}/experiencias`, formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-red-800 rounded-xl p-6 mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Agregar Experiencia Docente</h1>
        <Link
          href={`/docentes/${docente.id}`}
          className="bg-yellow-400 text-red-800 px-4 py-2 rounded font-semibold hover:bg-yellow-300"
        >
          Regresar
        </Link>
      </div>

      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-red-800 mb-6">
          Docente: {docente.nombres} {docente.apellido_paterno}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Año de ingreso:
            </label>
            <input
              type="number"
              value={formData.anio_ingreso}
              onChange={(e) => handleChange("anio_ingreso", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="2024"
              min="1900"
              max="2100"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Departamento al que pertenece:
            </label>
            <select
              value={formData.carrera_id}
              onChange={(e) => handleChange("carrera_id", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="">Seleccione una carrera</option>
              {carreras.map((carrera) => (
                <option key={carrera.id} value={carrera.id}>
                  {carrera.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Horas de nombramiento:
            </label>
            <input
              type="number"
              value={formData.horas_nombramiento}
              onChange={(e) =>
                handleChange("horas_nombramiento", e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="40"
              min="1"
              required
            />
          </div>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              checked={formData.presidente_academia}
              onChange={(e) =>
                handleChange("presidente_academia", e.target.checked)
              }
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label className="ml-2 text-gray-700 font-semibold">
              Presidente de academia
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-semibold transition"
            >
              Guardar experiencia
            </button>
            <Link
              href={`/docentes/${docente.id}`}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 font-semibold text-center transition"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}