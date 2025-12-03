import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

export default function PorDocente() {
  const { docentes, carreras } = usePage().props;
  const [carreraId, setCarreraId] = useState("");
  const [docenteId, setDocenteId] = useState("");
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [promedios, setPromedios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (docenteId) {
      setLoading(true);
      setError(null);

      axios.get(`/evaluaciones/evaluaciondocente/data/docente/${docenteId}`)
        .then(res => {
          setEvaluaciones(res.data.evaluaciones || []);
          setPromedios(res.data.promediosSemestre || []);
        })
        .catch(err => {
          console.error(err);
          setError("Error al cargar las evaluaciones");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setEvaluaciones([]);
      setPromedios([]);
    }
  }, [docenteId]);

  // Filtrar docentes por carrera
  const docentesFiltrados = docentes.filter(d => d.carrera_id == carreraId);

  // Info del docente
  const docenteSeleccionado = docentes.find(d => d.id == docenteId);
  const nombreDocente = docenteSeleccionado
    ? `${docenteSeleccionado.nombres} ${docenteSeleccionado.apellido_paterno} ${docenteSeleccionado.apellido_materno}`
    : "";

  // FUNCIÓN PARA COLOR Y EVALUACIÓN
  const getColorClass = (promedio) => {
    const p = parseFloat(promedio);

    if (p < 3.25) return "text-red-600 bg-red-50";
    if (p < 3.75) return "text-orange-600 bg-orange-50";
    if (p < 4.25) return "text-yellow-600 bg-yellow-50";
    if (p < 4.75) return "text-blue-600 bg-blue-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Encabezado */}
      <div className="bg-red-800 rounded-xl p-6 mb-8 shadow-md">
        <h1 className="text-3xl font-bold text-white text-center">
          Histórico por Docente
        </h1>
      </div>

      <div className="max-w-7xl mx-auto">

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Seleccionar Carrera:
              </label>
              <select
                value={carreraId}
                onChange={e => {
                  setCarreraId(e.target.value);
                  setDocenteId("");
                }}
                className="w-full border border-gray-300 rounded-lg p-3"
              >
                <option value="">Seleccione una carrera</option>
                {carreras.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Seleccionar Docente:
              </label>
              <select
                value={docenteId}
                onChange={e => setDocenteId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3"
                disabled={!carreraId}
              >
                <option value="">Seleccione un docente</option>
                {docentesFiltrados.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.nombres} {d.apellido_paterno} {d.apellido_materno}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {nombreDocente && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-medium">
                Mostrando evaluaciones de:{" "}
                <span className="font-bold">{nombreDocente}</span>
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
            <p className="mt-4 text-gray-600">Cargando evaluaciones...</p>
          </div>
        )}

        {/* TABLA */}
        {!loading && docenteId && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Tabla de Evaluaciones
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">Semestre</th>
                    <th className="p-3">Resultado Global</th>
                    <th className="p-3">Dominio</th>
                    <th className="p-3">Planificación</th>
                    <th className="p-3">Ambiente</th>
                    <th className="p-3">Comunicación</th>
                  </tr>
                </thead>

                <tbody>
                  {evaluaciones.map(ev => {
                    const color = getColorClass(ev.resultado_global);

                    return (
                      <tr key={ev.id}>
                        <td className="p-3">{ev.semestre}</td>

                        <td
                          className={`p-3 font-bold rounded-lg ${color}`}
                        >
                          {ev.resultado_global}
                        </td>

                        <td className={color + " p-3 rounded-lg"}>
                          {ev.dominio_asignatura}
                        </td>

                        <td className={color + " p-3 rounded-lg"}>
                          {ev.planificacion_curso}
                        </td>

                        <td className={color + " p-3 rounded-lg"}>
                          {ev.ambiente_aprendizaje}
                        </td>

                        <td className={color + " p-3 rounded-lg"}>
                          {ev.comunicacion}
                        </td>
                      </tr>
                    );
                  })}

                  {evaluaciones.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center p-8 text-gray-500">
                        No hay evaluaciones registradas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GRÁFICA DE BARRAS */}
        {!loading && promedios.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Evolución del Resultado Global por Semestre
            </h2>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={promedios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semestre" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />

                <Bar
                  dataKey="promedio"
                  name="Promedio"
                  fill="#991b1b"
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
