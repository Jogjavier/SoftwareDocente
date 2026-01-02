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
          setPromedios(res.data.promediosPeriodo || []);
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

  // FUNCIÓN PARA COLOR SEGÚN CALIFICACIÓN (INDIVIDUAL POR CELDA)
  const getColorClass = (valor) => {
    const v = parseFloat(valor);
    
    if (v < 3.25) return "bg-red-100 text-red-800 font-semibold"; // Insatisfactorio
    if (v < 3.75) return "bg-orange-100 text-orange-800 font-semibold"; // Suficiente
    if (v < 4.25) return "bg-yellow-100 text-yellow-800 font-semibold"; // Bueno
    if (v < 4.75) return "bg-blue-100 text-blue-800 font-semibold"; // Notable
    return "bg-green-100 text-green-800 font-semibold"; // Sobresaliente
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
        
        {/* GRÁFICA DE BARRAS */}
        {!loading && promedios.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Evolución del Resultado Global por Periodo
            </h2>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={promedios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo_completo" />
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

        {/* Leyenda de colores */}
        {!loading && docenteId && evaluaciones.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Escala de Evaluación:</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-sm">0.0 - 3.25 (Insatisfactorio)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-100 border border-orange-300 rounded"></div>
                <span className="text-sm">3.25 - 3.75 (Suficiente)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span className="text-sm">3.75 - 4.25 (Bueno)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 border border-blue-300 rounded"></div>
                <span className="text-sm">4.25 - 4.75 (Notable)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-sm">4.75 - 5.0 (Sobresaliente)</span>
              </div>
            </div>
          </div>
        )}

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
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border border-gray-300">Periodo</th>
                    <th className="p-3 border border-gray-300">Resultado Global</th>
                    <th className="p-3 border border-gray-300">Dominio de la Asignatura</th>
                    <th className="p-3 border border-gray-300">Planificación del Curso</th>
                    <th className="p-3 border border-gray-300">Ambientes de Aprendisaje</th>
                    <th className="p-3 border border-gray-300">Estrategias, métodos y técnicas</th>
                    <th className="p-3 border border-gray-300">Motivación</th>
                    <th className="p-3 border border-gray-300">Evaluación</th>
                    <th className="p-3 border border-gray-300">Comunicación</th>
                    <th className="p-3 border border-gray-300">Gestión del curso</th>
                    <th className="p-3 border border-gray-300">Tecnologías de la información y comunicación</th>
                    <th className="p-3 border border-gray-300">Satisfacción General</th>
                  </tr>
                </thead>

                <tbody>
                  {evaluaciones.map(ev => {
                    // Crear el semestre completo
                    const semestreCompleto = `${ev.periodo} ${ev.anio}`;
                    
                    return (
                      <tr key={ev.id}>
                        <td className="p-3 border border-gray-300 font-medium">
                          {semestreCompleto}
                        </td>

                        <td className={`p-3 border border-gray-300 text-center ${getColorClass(ev.resultado_global)}`}>
                          {parseFloat(ev.resultado_global).toFixed(2)}
                        </td>

                        <td className={`p-3 border border-gray-300 text-center ${getColorClass(ev.dominio_asignatura)}`}>
                          {parseFloat(ev.dominio_asignatura).toFixed(2)}
                        </td>

                        <td className={`p-3 border border-gray-300 text-center ${getColorClass(ev.planificacion_curso)}`}>
                          {parseFloat(ev.planificacion_curso).toFixed(2)}
                        </td>

                        <td className={`p-3 border border-gray-300 text-center ${getColorClass(ev.ambiente_aprendizaje)}`}>
                          {parseFloat(ev.ambiente_aprendizaje).toFixed(2)}
                        </td>

                        <td className={`p-3 border border-gray-300 text-center ${getColorClass(ev.estrategias_metodos)}`}>
                          {parseFloat(ev.estrategias_metodos).toFixed(2)}
                        </td>

                        <td className={`p-3 border border-gray-300 text-center ${getColorClass(ev.motivacion)}`}>
                          {parseFloat(ev.motivacion).toFixed(2)}
                        </td>

                        <td className={`p-3 border border-gray-300 text-center ${getColorClass(ev.evaluacion)}`}>
                          {parseFloat(ev.evaluacion).toFixed(2)}
                        </td>

                        <td className={`p-3 border border-gray-300 text-center ${getColorClass(ev.comunicacion)}`}>
                          {parseFloat(ev.comunicacion).toFixed(2)}
                        </td>

                        <td className={`p-3 border border-gray-300 text-center ${getColorClass(ev.gestion_recurso)}`}>
                          {parseFloat(ev.gestion_recurso).toFixed(2)}
                        </td>

                        <td className={`p-3 border border-gray-300 text-center ${getColorClass(ev.tecnologias)}`}>
                          {parseFloat(ev.tecnologias).toFixed(2)}
                        </td>

                        <td className={`p-3 border border-gray-300 text-center ${getColorClass(ev.satisfaccion)}`}>
                          {parseFloat(ev.satisfaccion).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}

                  {evaluaciones.length === 0 && (
                    <tr>
                      <td colSpan="12" className="text-center p-8 text-gray-500">
                        No hay evaluaciones registradas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}