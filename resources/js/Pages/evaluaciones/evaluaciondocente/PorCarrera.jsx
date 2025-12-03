import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";

export default function PorCarrera() {
  const { carreras } = usePage().props;
  const [carreraId, setCarreraId] = useState("");
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [promedioPorDocente, setPromedioPorDocente] = useState([]);
  const [promediosSemestre, setPromediosSemestre] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔄 CARGA DE DATOS DINÁMICOS
  useEffect(() => {
    if (carreraId) {
      setLoading(true);
      setError(null);

      axios.get(`/evaluaciones/evaluaciondocente/data/carrera/${carreraId}`)
        .then(res => {
          setEvaluaciones(res.data.evaluaciones || []);
          setPromedioPorDocente(res.data.promedioPorDocente || []);
          setPromediosSemestre(res.data.promediosSemestre || []);
        })
        .catch(err => {
          console.error(err);
          setError("Error al cargar las evaluaciones de la carrera");
        })
        .finally(() => setLoading(false));
    } else {
      setEvaluaciones([]);
      setPromedioPorDocente([]);
      setPromediosSemestre([]);
    }
  }, [carreraId]);

  const carreraSeleccionada = carreras.find(c => c.id == carreraId);
  const nombreCarrera = carreraSeleccionada ? carreraSeleccionada.nombre : "";

  // 🎨 FUNCIÓN PARA COLORES POR PROMEDIO
  const obtenerColorEvaluacion = (promedio) => {
    let evaluacion = "Excelente";
    let colorClass = "text-green-600 bg-green-50";

    if (promedio < 3.25) {
      evaluacion = "Insuficiente";
      colorClass = "text-red-600 bg-red-50";
    } else if (promedio < 3.75) {
      evaluacion = "Suficiente";
      colorClass = "text-orange-600 bg-orange-50";
    } else if (promedio < 4.25) {
      evaluacion = "Bueno";
      colorClass = "text-yellow-600 bg-yellow-50";
    } else if (promedio < 4.75) {
      evaluacion = "Notable";
      colorClass = "text-blue-600 bg-blue-50";
    }

    return { evaluacion, colorClass };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 🔴 ENCABEZADO */}
      <div className="bg-red-800 rounded-xl p-6 mb-8 shadow-md">
        <h1 className="text-3xl font-bold text-white text-center">
          Histórico por Carrera
        </h1>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* 🎓 SELECTOR DE CARRERA */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <label className="block text-gray-700 font-semibold mb-2">
            Seleccionar Carrera:
          </label>

          <select
            value={carreraId}
            onChange={e => setCarreraId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
          >
            <option value="">Seleccione una carrera</option>
            {carreras.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>

          {nombreCarrera && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-purple-800 font-medium">
                Mostrando evaluaciones de:{" "}
                <span className="font-bold">{nombreCarrera}</span>
              </p>
            </div>
          )}
        </div>

        {/* ⚠ MENSAJE DE ERROR */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* ⏳ LOADING */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
            <p className="mt-4 text-gray-600">Cargando evaluaciones...</p>
          </div>
        )}

        {/* 📊 GRÁFICAS */}
        {!loading && carreraId && (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              
              {/* 📊 GRÁFICA 1: Promedio por docente */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Promedio por Docente
                </h2>

                {promedioPorDocente.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={promedioPorDocente}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="docente"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={100}
                      />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="promedio" fill="#991b1b" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
                )}
              </div>

              {/* 📊 GRÁFICA 2: EVOLUCIÓN POR SEMESTRE — ahora BAR CHART */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Evolución por Semestre
                </h2>

                {promediosSemestre.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={promediosSemestre}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="semestre" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="promedio" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
                )}
              </div>
            </div>

            {/* 📋 TABLA DETALLADA CON COLORES POR PROMEDIO */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Tabla de Evaluaciones Detallada
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-700">Docente</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Semestre</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Resultado Global</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Dominio</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Planificación</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Comunicación</th>
                    </tr>
                  </thead>

                  <tbody>
                    {evaluaciones.map((ev, idx) => {
                      // color según promedio
                      const { evaluacion, colorClass } = obtenerColorEvaluacion(ev.resultado_global);

                      return (
                        <tr key={ev.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="p-3">
                            {ev.docente
                              ? `${ev.docente.nombres} ${ev.docente.apellido_paterno} ${ev.docente.apellido_materno}`
                              : "—"}
                          </td>

                          <td className="p-3">{ev.semestre}</td>

                          <td className="p-3">
                            <span className={`px-3 py-1 rounded-lg font-semibold ${colorClass}`}>
                              {evaluacion} ({ev.resultado_global})
                            </span>
                          </td>

                          <td className="p-3">{ev.dominio_asignatura}</td>
                          <td className="p-3">{ev.planificacion_curso}</td>
                          <td className="p-3">{ev.comunicacion}</td>
                        </tr>
                      );
                    })}

                    {evaluaciones.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center p-8 text-gray-500">
                          No hay evaluaciones registradas para esta carrera
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 📌 RESUMEN */}
              {evaluaciones.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-purple-600 text-sm font-medium mb-1">Total Evaluaciones</p>
                    <p className="text-3xl font-bold text-purple-800">
                      {evaluaciones.length}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-blue-600 text-sm font-medium mb-1">Docentes Evaluados</p>
                    <p className="text-3xl font-bold text-blue-800">
                      {promedioPorDocente.length}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-green-600 text-sm font-medium mb-1">Semestres Registrados</p>
                    <p className="text-3xl font-bold text-green-800">
                      {promediosSemestre.length}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
