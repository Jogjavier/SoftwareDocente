import React from "react";
import { Link, router, usePage } from "@inertiajs/react";

export default function Index({ registros, filters, carreras, anios }) {

  const applyFilter = (key, value) => {
    router.get(
      route("docentes.activardocente.index"),
      { ...filters, [key]: value },
      { preserveState: true }
    );
  };

  const clearFilters = () => {
    router.get(route("docentes.activardocente.index"));
  };

  const handleDelete = (id) => {
    if (confirm("¿Eliminar este registro?")) {
      router.delete(route("docentes.activardocente.destroy", id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">

      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-red-800">
          Activación de Docentes
        </h1>

        {/* Botones */}
        <div className="flex items-center space-x-3">
            <button
              onClick={() => router.visit("/")}
              className="bg-red-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Inicio
            </button>

            <Link
              href={route("docentes.activardocente.create")}
              className="bg-red-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              + Crear
            </Link>
          </div>
        </div>



        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          
          {/* Estado */}
          <select
            className="border rounded-lg px-4 py-2"
            value={filters.activo ?? ""}
            onChange={(e) => applyFilter("activo", e.target.value)}
          >
            <option value="">Todos</option>
            <option value="1">Activos</option>
            <option value="0">Inactivos</option>
          </select>

          {/* Semestre */}
          <select
            className="border rounded-lg px-4 py-2"
            value={filters.semestre ?? ""}
            onChange={(e) => applyFilter("semestre", e.target.value)}
          >
            <option value="">Todos los semestres</option>
            <option value="ENE-JUN">ENE - JUN</option>
            <option value="AGO-DIC">AGO - DIC</option>
          </select>

          {/* Año */}
          <select
            className="border rounded-lg px-4 py-2"
            value={filters.anio ?? ""}
            onChange={(e) => applyFilter("anio", e.target.value)}
          >
            <option value="">Todos los años</option>
            {anios.map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>

          {/* Carrera */}
          <select
            className="border rounded-lg px-4 py-2"
            value={filters.carrera_id ?? ""}
            onChange={(e) => applyFilter("carrera_id", e.target.value)}
          >
            <option value="">Todas las carreras</option>
            {carreras.map((carrera) => (
              <option key={carrera.id} value={carrera.id}>
                {carrera.nombre}
              </option>
            ))}
          </select>

          {/* Limpiar */}
          <button
            onClick={clearFilters}
            className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600 transition"
          >
            Limpiar filtros
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="px-4 py-3">Docente</th>
                <th className="px-4 py-3">Carrera</th>
                <th className="px-4 py-3 text-center">Semestre</th>
                <th className="px-4 py-3 text-center">Año</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {registros.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No hay registros
                  </td>
                </tr>
              )}

              {registros.map((registro) => (
                <tr key={registro.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {registro.docente
                      ? `${registro.docente.nombres} ${registro.docente.apellido_paterno} ${registro.docente.apellido_materno}`
                      : "—"}
                  </td>

                  <td className="px-4 py-3">
                    {registro.carrera?.nombre ?? "—"}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {registro.semestre}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {registro.anio}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold
                      ${registro.activo
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"}`}
                    >
                      {registro.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center space-x-2">
                    <Link
                      href={route("docentes.activardocente.edit", registro.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => handleDelete(registro.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
