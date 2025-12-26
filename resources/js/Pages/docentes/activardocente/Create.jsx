import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function Create({ docentes, carreras }) {
  const { data, setData, post, processing, errors } = useForm({
    docente_id: "",
    carrera_id: "",
    semestre: "",
    anio: new Date().getFullYear(),
    activo: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("docentes.activardocente.store"));
  };

  const docentesFiltrados = data.carrera_id
  ? docentes.filter(
      (docente) => docente.carrera_id == data.carrera_id
    )
  : [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-red-800 mb-6">
          Activar / Desactivar Docente por Semestre
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Carrera */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Carrera
            </label>
            <select
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-red-200"
              value={data.carrera_id}
              onChange={(e) => setData("carrera_id", e.target.value)}
            >
              <option value="">Seleccione una carrera</option>
              {carreras.map((carrera) => (
                <option key={carrera.id} value={carrera.id}>
                  {carrera.nombre}
                </option>
              ))}
            </select>
            {errors.carrera_id && (
              <p className="text-red-600 text-sm mt-1">
                {errors.carrera_id}
              </p>
            )}
          </div>

          {/* Docente */}
<div>
  <label className="block font-semibold text-gray-700 mb-1">
    Docente
  </label>
  <select
    className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-red-200"
    value={data.docente_id}
    onChange={(e) => setData("docente_id", e.target.value)}
    disabled={!data.carrera_id}
  >
    <option value="">
      {data.carrera_id
        ? "Seleccione un docente"
        : "Seleccione primero una carrera"}
    </option>

    {docentesFiltrados.map((docente) => (
      <option key={docente.id} value={docente.id}>
        {docente.nombres} {docente.apellido_paterno} {docente.apellido_materno}
      </option>
    ))}
  </select>

  {errors.docente_id && (
    <p className="text-red-600 text-sm mt-1">
      {errors.docente_id}
    </p>
  )}
</div>

          {/* Semestre */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Semestre
            </label>
            <select
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-red-200"
              value={data.semestre}
              onChange={(e) => setData("semestre", e.target.value)}
            >
              <option value="">Seleccione el semestre</option>
              <option value="ENE-JUN">ENE - JUN</option>
              <option value="AGO-DIC">AGO - DIC</option>
            </select>
            {errors.semestre && (
              <p className="text-red-600 text-sm mt-1">
                {errors.semestre}
              </p>
            )}
          </div>

          {/* Año */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Año
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-red-200"
              value={data.anio}
              onChange={(e) => setData("anio", e.target.value)}
            />
            {errors.anio && (
              <p className="text-red-600 text-sm mt-1">{errors.anio}</p>
            )}
          </div>

          {/* Activo */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">
              Estado del docente
            </span>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={data.activo}
                onChange={(e) => setData("activo", e.target.checked)}
              />
              <div
                className={`w-12 h-6 rounded-full transition ${
                  data.activo ? "bg-red-800" : "bg-gray-400"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow transform transition ${
                    data.activo ? "translate-x-6" : ""
                  }`}
                />
              </div>
              <span className="ml-3 font-medium">
                {data.activo ? "Activo" : "Inactivo"}
              </span>
            </label>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="submit"
              disabled={processing}
              className="bg-red-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 transition"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
