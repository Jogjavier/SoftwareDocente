import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";

export default function PorCarrera() {
  const { carreras } = usePage().props;
  const [carreraId, setCarreraId] = useState("");
  const [periodoFiltro, setPeriodoFiltro] = useState("");
  const [anioFiltro, setAnioFiltro] = useState("");
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [promedioPorDocente, setPromedioPorDocente] = useState([]);
  const [promediosSemestre, setPromediosSemestre] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // CARGA DE DATOS DINÁMICOS
  useEffect(() => {
    if (carreraId) {
      setLoading(true);
      setError(null);

      axios.get(`/evaluaciones/evaluaciondepartamental/data/carrera/${carreraId}`)
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

  // Filtrar evaluaciones por periodo y año
  const evaluacionesFiltradas = evaluaciones.filter(ev => {
    const cumplePeriodo = !periodoFiltro || ev.periodo === periodoFiltro;
    const cumpleAnio = !anioFiltro || ev.anio == anioFiltro;
    return cumplePeriodo && cumpleAnio;
  });

  // NUEVO: Obtener periodos únicos para el selector
  const periodosUnicos = [...new Set(evaluaciones.map(ev => ev.periodo))].sort();
  
  // NUEVO: Obtener años únicos para el selector
  const aniosUnicos = [...new Set(evaluaciones.map(ev => ev.anio))].sort((a, b) => b - a);

  const getColorClass = (valor) => {
    const v = parseFloat(valor);
    
    if (isNaN(v)) return "bg-gray-100 text-gray-800";
    
    if (v < 3.25) return "bg-red-100 text-red-800 font-semibold";
    if (v < 3.75) return "bg-orange-100 text-orange-800 font-semibold";
    if (v < 4.25) return "bg-yellow-100 text-yellow-800 font-semibold";
    if (v < 4.75) return "bg-blue-100 text-blue-800 font-semibold";
    return "bg-green-100 text-green-800 font-semibold";
  };

  const getEtiquetaEvaluacion = (valor) => {
    const v = parseFloat(valor);
    
    if (v < 3.25) return "Insatisfactorio";
    if (v < 3.75) return "Suficiente";
    if (v < 4.25) return "Bueno";
    if (v < 4.75) return "Notable";
    return "Sobresaliente";
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
        
        {/* 🎓 SELECTOR DE CARRERA Y FILTROS */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Selector de Carrera */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Seleccionar Carrera:
              </label>
              <select
                value={carreraId}
                onChange={e => {
                  setCarreraId(e.target.value);
                  setPeriodoFiltro(""); // Resetear filtros
                  setAnioFiltro("");
                }}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
              >
                <option value="">Seleccione una carrera</option>
                {carreras.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            {/* NUEVO: Filtro de Periodo */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Filtrar por Periodo:
              </label>
              <select
                value={periodoFiltro}
                onChange={e => setPeriodoFiltro(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
                disabled={!carreraId}
              >
                <option value="">Todos los periodos</option>
                {periodosUnicos.map(periodo => (
                  <option key={periodo} value={periodo}>{periodo}</option>
                ))}
              </select>
            </div>

            {/* NUEVO: Filtro de Año */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Filtrar por Año:
              </label>
              <select
                value={anioFiltro}
                onChange={e => setAnioFiltro(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
                disabled={!carreraId}
              >
                <option value="">Todos los años</option>
                {aniosUnicos.map(anio => (
                  <option key={anio} value={anio}>{anio}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Información de selección */}
          {nombreCarrera && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-purple-800 font-medium">
                Mostrando evaluaciones de:{" "}
                <span className="font-bold">{nombreCarrera}</span>
                {periodoFiltro && <span> - Periodo: <span className="font-bold">{periodoFiltro}</span></span>}
                {anioFiltro && <span> - Año: <span className="font-bold">{anioFiltro}</span></span>}
              </p>
              <p className="text-purple-600 text-sm mt-1">
                {evaluacionesFiltradas.length} evaluación(es) encontrada(s)
              </p>
            </div>
          )}

          {/* NUEVO: Botón para limpiar filtros */}
          {(periodoFiltro || anioFiltro) && (
            <button
              onClick={() => {
                setPeriodoFiltro("");
                setAnioFiltro("");
              }}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Limpiar Filtros
            </button>
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
            <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-6xl mx-auto">
  
              <div className="md:col-span-2 flex justify-center">
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    Promedio por Docente
                  </h2>

                  {promedioPorDocente.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart 
                        data={promedioPorDocente}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
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
                    <p className="text-gray-500 text-center py-8">
                      No hay datos disponibles
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* Leyenda de colores */}
            {evaluacionesFiltradas.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Escala de Evaluación:</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-200 border-2 border-red-400 rounded"></div>
                    <span className="text-sm">0.0 - 3.25 (Insatisfactorio)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-200 border-2 border-orange-400 rounded"></div>
                    <span className="text-sm">3.25 - 3.75 (Suficiente)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-200 border-2 border-yellow-400 rounded"></div>
                    <span className="text-sm">3.75 - 4.25 (Bueno)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-200 border-2 border-blue-400 rounded"></div>
                    <span className="text-sm">4.25 - 4.75 (Notable)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-200 border-2 border-green-400 rounded"></div>
                    <span className="text-sm">4.75 - 5.0 (Sobresaliente)</span>
                  </div>
                </div>
              </div>
            )}

            {/* 📋 TABLA DETALLADA CON COLORES INDIVIDUALES */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Tabla de Evaluaciones Detallada
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 border border-gray-300">Docente</th>
                      <th className="p-3 border border-gray-300">Periodo</th>
                      <th className="p-3 border border-gray-300">Resultado Global</th>
                      <th className="p-3 border border-gray-300">Docencia</th>
                      <th className="p-3 border border-gray-300">Tutoría</th>
                      <th className="p-3 border border-gray-300">Vinculación</th>
                      <th className="p-3 border border-gray-300">Gestión</th>
                      <th className="p-3 border border-gray-300">Global</th>
                    </tr>
                  </thead>

                  <tbody>
  {evaluacionesFiltradas.map((ev) => {
    const periodoCompleto =
      ev.semestre_completo || `${ev.periodo} ${ev.anio}`;

    return (
      <tr key={ev.id} className="hover:bg-gray-50">
        {/* Docente */}
        <td className="p-3 border border-gray-300">
          {ev.docente
            ? `${ev.docente.nombres} ${ev.docente.apellido_paterno} ${ev.docente.apellido_materno}`
            : "—"}
        </td>

        {/* Periodo */}
        <td className="p-3 border border-gray-300 font-medium">
          {periodoCompleto}
        </td>

        {/* Resultado global */}
        <td
          className={`p-3 border border-gray-300 text-center ${getColorClass(
            ev.resultado_global
          )}`}
        >
          {Number(ev.resultado_global).toFixed(2)}
        </td>

        {/* Docencia */}
        <td
          className={`p-3 border border-gray-300 text-center ${getColorClass(
            ev.docencia
          )}`}
        >
          {Number(ev.docencia).toFixed(2)}
        </td>

        {/* Tutoría */}
        <td
          className={`p-3 border border-gray-300 text-center ${getColorClass(
            ev.tutoria
          )}`}
        >
          {Number(ev.tutoria).toFixed(2)}
        </td>

        {/* Vinculación */}
        <td
          className={`p-3 border border-gray-300 text-center ${getColorClass(
            ev.vinculacion
          )}`}
        >
          {Number(ev.vinculacion).toFixed(2)}
        </td>

        {/* Gestión */}
        <td
          className={`p-3 border border-gray-300 text-center ${getColorClass(
            ev.gestion
          )}`}
        >
          {Number(ev.gestion).toFixed(2)}
        </td>

        {/* Global */}
        <td
          className={`p-3 border border-gray-300 text-center ${getColorClass(
            ev.global
          )}`}
        >
          {Number(ev.global).toFixed(2)}
        </td>
      </tr>
    );
  })}

  {evaluacionesFiltradas.length === 0 && (
    <tr>
      <td colSpan="8" className="text-center p-8 text-gray-500">
        {carreraId
          ? "No hay evaluaciones para los filtros seleccionados"
          : "No hay evaluaciones registradas para esta carrera"}
      </td>
    </tr>
  )}
</tbody>

                </table>
              </div>

              {/* 📌 RESUMEN */}
              {evaluacionesFiltradas.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-purple-600 text-sm font-medium mb-1">Total Evaluaciones</p>
                    <p className="text-3xl font-bold text-purple-800">
                      {evaluacionesFiltradas.length}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-blue-600 text-sm font-medium mb-1">Docentes Evaluados</p>
                    <p className="text-3xl font-bold text-blue-800">
                      {[...new Set(evaluacionesFiltradas.map(e => e.docente_id))].length}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-green-600 text-sm font-medium mb-1">Periodos Registrados</p>
                    <p className="text-3xl font-bold text-green-800">
                      {[...new Set(evaluacionesFiltradas.map(e => `${e.periodo} ${e.anio}`))].length}
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