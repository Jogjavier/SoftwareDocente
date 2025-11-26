import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, 
  LineChart, Line, Legend, PieChart, Pie, Cell 
} from "recharts";
import { TrendingUp, Award, Calendar } from "lucide-react";

export default function General() {
  const { carreras } = usePage().props;
  const [dataCarreras, setDataCarreras] = useState([]);
  const [promediosSemestre, setPromediosSemestre] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // RUTA CORREGIDA
    axios.get('/evaluaciones/evaluaciondocente/data/general')
      .then(res => {
        console.log("Datos generales recibidos:", res.data);
        setDataCarreras(res.data.promedioPorCarrera || []);
        setPromediosSemestre(res.data.promediosSemestre || []);
      })
      .catch(err => {
        console.error("Error al cargar datos generales:", err);
        setError("Error al cargar los datos generales");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Colores para las gráficas
  const COLORS = ['#991b1b', '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca'];

  // Calcular estadísticas
  const promedioGeneral = dataCarreras.length > 0
    ? (dataCarreras.reduce((acc, curr) => acc + parseFloat(curr.promedio), 0) / dataCarreras.length).toFixed(2)
    : "0.00";

  const mejorCarrera = dataCarreras.length > 0
    ? dataCarreras.reduce((max, curr) => parseFloat(curr.promedio) > parseFloat(max.promedio) ? curr : max, dataCarreras[0])
    : null;

  const totalSemestres = promediosSemestre.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 rounded-xl p-6 mb-8 shadow-md">
        <h1 className="text-3xl font-bold text-white text-center">
          Evaluación General Institucional
        </h1>
        <p className="text-yellow-200 text-center mt-2">
          Vista panorámica del desempeño académico en todas las carreras
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-red-800"></div>
            <p className="mt-4 text-gray-600 text-lg">Cargando datos institucionales...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Promedio General</p>
                    <p className="text-4xl font-bold text-green-600">{promedioGeneral}</p>
                    <p className="text-gray-500 text-xs mt-1">De todas las carreras</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Mejor Carrera</p>
                    <p className="text-xl font-bold text-blue-600">
                      {mejorCarrera ? mejorCarrera.carrera : "N/A"}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Promedio: {mejorCarrera ? mejorCarrera.promedio : "0"}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Semestres Evaluados</p>
                    <p className="text-4xl font-bold text-purple-600">{totalSemestres}</p>
                    <p className="text-gray-500 text-xs mt-1">Períodos registrados</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Calendar className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficas principales */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Gráfica: Promedio por Carrera */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-red-800 rounded"></div>
                  Promedio por Carrera
                </h2>
                {dataCarreras.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={dataCarreras}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="carrera" 
                        angle={-45} 
                        textAnchor="end" 
                        height={120}
                        interval={0}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="promedio" fill="#991b1b" name="Promedio" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-12">No hay datos disponibles</p>
                )}
              </div>

              {/* Gráfica: Evolución por Semestre */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-green-600 rounded"></div>
                  Evolución por Semestre
                </h2>
                {promediosSemestre.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={promediosSemestre}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="semestre" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="promedio" 
                        stroke="#16a34a" 
                        strokeWidth={3}
                        name="Promedio General"
                        dot={{ fill: '#16a34a', r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-12">No hay datos disponibles</p>
                )}
              </div>
            </div>

            {/* Tabla detallada de carreras */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                Tabla Comparativa por Carrera
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">Posición</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Carrera</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Promedio</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Evaluación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataCarreras
                      .sort((a, b) => parseFloat(b.promedio) - parseFloat(a.promedio))
                      .map((carrera, idx) => {
                        const promedio = parseFloat(carrera.promedio);
                        let evaluacion = "Excelente";
                        let colorClass = "text-green-600 bg-green-50";
                        
                        if (promedio < 7) {
                          evaluacion = "Necesita Mejora";
                          colorClass = "text-red-600 bg-red-50";
                        } else if (promedio < 8.5) {
                          evaluacion = "Bueno";
                          colorClass = "text-yellow-600 bg-yellow-50";
                        }

                        return (
                          <tr key={carrera.carrera_id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-4">
                              <span className="font-bold text-gray-600">#{idx + 1}</span>
                            </td>
                            <td className="p-4 font-medium">{carrera.carrera}</td>
                            <td className="p-4">
                              <span className="font-bold text-2xl text-red-800">
                                {carrera.promedio}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
                                {evaluacion}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    {dataCarreras.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center p-8 text-gray-500">
                          No hay datos de carreras disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Información adicional */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  📊 Análisis Institucional Completo
                </h3>
                <p className="text-gray-600">
                  Este reporte muestra el desempeño general de todas las carreras evaluadas.
                  Los datos se actualizan automáticamente con cada nueva evaluación registrada.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}