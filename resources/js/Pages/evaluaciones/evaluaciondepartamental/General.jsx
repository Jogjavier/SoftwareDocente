import React, { useEffect, useState } from "react";
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
  Legend,
} from "recharts";
import { TrendingUp, Award, Calendar } from "lucide-react";

export default function General() {
  const { carreras } = usePage().props;
  const [dataCarreras, setDataCarreras] = useState([]);
  const [promediosSemestre, setPromediosSemestre] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // NUEVO: Estados para los filtros
  const [periodoFiltro, setPeriodoFiltro] = useState("");
  const [anioFiltro, setAnioFiltro] = useState("");
  const [evaluacionesTodas, setEvaluacionesTodas] = useState([]);

  useEffect(() => {
    axios.get("/evaluaciones/evaluaciondepartamental/data/general")
      .then(res => {
        setDataCarreras(res.data.promedioPorCarrera || []);
        setPromediosSemestre(res.data.promediosSemestre || []);
        setEvaluacionesTodas(res.data.evaluacionesTodas || []); // Si tu backend lo proporciona
      })
      .catch(() => setError("Error al cargar los datos generales"))
      .finally(() => setLoading(false));
  }, []);

  // NUEVO: Obtener periodos y años únicos
  const periodosUnicos = [...new Set(promediosSemestre.map(p => p.periodo))].filter(Boolean).sort();
  const aniosUnicos = [...new Set(promediosSemestre.map(p => p.anio))].filter(Boolean).sort((a, b) => b - a);

  // NUEVO: Filtrar promedios por semestre según filtros
  const promediosSemestreFiltrados = promediosSemestre.filter(p => {
    const cumplePeriodo = !periodoFiltro || p.periodo === periodoFiltro;
    const cumpleAnio = !anioFiltro || p.anio == anioFiltro;
    return cumplePeriodo && cumpleAnio;
  });

  const promedioGeneral = dataCarreras.length
    ? (
        dataCarreras.reduce((a, b) => a + parseFloat(b.promedio), 0) /
        dataCarreras.length
      ).toFixed(2)
    : "0.00";

  const mejorCarrera = dataCarreras.length
    ? dataCarreras.reduce((max, curr) =>
        parseFloat(curr.promedio) > parseFloat(max.promedio) ? curr : max
      )
    : null;
  
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
          Evaluación General Institucional
        </h1>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* NUEVO: Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Filtros de Visualización</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro de Periodo */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Filtrar por Periodo:
              </label>
              <select
                value={periodoFiltro}
                onChange={e => setPeriodoFiltro(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
              >
                <option value="">Todos los periodos</option>
                {periodosUnicos.map(periodo => (
                  <option key={periodo} value={periodo}>{periodo}</option>
                ))}
              </select>
            </div>

            {/* Filtro de Año */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Filtrar por Año:
              </label>
              <select
                value={anioFiltro}
                onChange={e => setAnioFiltro(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
              >
                <option value="">Todos los años</option>
                {aniosUnicos.map(anio => (
                  <option key={anio} value={anio}>{anio}</option>
                ))}
              </select>
            </div>

            {/* Botón Limpiar */}
            <div className="flex items-end">
              {(periodoFiltro || anioFiltro) && (
                <button
                  onClick={() => {
                    setPeriodoFiltro("");
                    setAnioFiltro("");
                  }}
                  className="w-full bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition"
                >
                  Limpiar Filtros
                </button>
              )}
            </div>
          </div>

          {/* Información de filtros activos */}
          {(periodoFiltro || anioFiltro) && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-medium">
                Filtros activos:
                {periodoFiltro && <span className="ml-2">Periodo: <span className="font-bold">{periodoFiltro}</span></span>}
                {anioFiltro && <span className="ml-2">Año: <span className="font-bold">{anioFiltro}</span></span>}
              </p>
              <p className="text-blue-600 text-sm mt-1">
                {promediosSemestreFiltrados.length} periodo(s) encontrado(s)
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
            <p className="mt-4 text-gray-600">Cargando datos...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* 📌 TARJETAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 text-sm">Promedio General</p>
                <p className="text-3xl font-bold text-green-600">{promedioGeneral}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 text-sm">Mejor Carrera</p>
                <p className="text-xl font-bold text-blue-600">
                  {mejorCarrera?.carrera || "—"}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 text-sm">Periodos Evaluados</p>
                <p className="text-3xl font-bold text-purple-600">
                  {promediosSemestreFiltrados.length || promediosSemestre.length}
                </p>
              </div>
            </div>

            {/* 📊 GRÁFICA PRINCIPAL CENTRADA */}
            <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-6xl mx-auto">
              <div className="md:col-span-2 flex justify-center">
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    Promedio por Carrera
                    {(periodoFiltro || anioFiltro) && (
                      <span className="text-sm text-gray-600 block mt-1">
                        {periodoFiltro && `${periodoFiltro} `}
                        {anioFiltro && `${anioFiltro}`}
                      </span>
                    )}
                  </h2>

                  {dataCarreras.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={dataCarreras}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="carrera"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
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

            {/* NUEVO: Gráfica de evolución por semestre */}
            {promediosSemestreFiltrados.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  Evolución de Promedios por Periodo
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={promediosSemestreFiltrados}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="semestre_completo"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="promedio" fill="#3b82f6" name="Promedio General" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* 📋 TABLA */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Tabla Detallada por Carrera
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 border border-gray-300">Carrera</th>
                      <th className="p-3 border border-gray-300 text-center">Promedio</th>
                      <th className="p-3 border border-gray-300 text-center">Evaluación</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dataCarreras.map((carrera) => (
                      <tr key={carrera.carrera_id} className="hover:bg-gray-50">
                        <td className="p-3 border border-gray-300 text-center font-semibold">
                          {carrera.carrera}
                        </td>

                        <td className={`p-3 border border-gray-300 text-center ${getColorClass(carrera.promedio)}`}>
                          {parseFloat(carrera.promedio).toFixed(2)}
                        </td>

                        <td className="p-3 border border-gray-300 text-center font-semibold">
                          {getEtiquetaEvaluacion(carrera.promedio)}
                        </td>
                      </tr>
                    ))}

                    {dataCarreras.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center p-8 text-gray-500">
                          No hay datos disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}