import React, { useState } from "react";
import { FaGraduationCap, FaSave, FaArrowLeft } from "react-icons/fa";
import { Inertia } from "@inertiajs/inertia";

export default function Edit({ carrera = { id: 1, nombre: "Ingeniería en Sistemas Computacionales", siglas: "ISC" } }) {
  const [nombre, setNombre] = useState(carrera?.nombre || "");
  const [siglas, setSiglas] = useState(carrera?.siglas || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simular envío de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Actualizando carrera:", { id: carrera.id, nombre, siglas });
      
      // Con Inertia (descomenta si lo usas):
      Inertia.put(`/catalogo/carreras/${carrera.id}`, { nombre, siglas });
      
      alert("Carrera actualizada exitosamente!");
    } catch (error) {
      console.error("Error al actualizar carrera:", error);
      alert("Error al actualizar la carrera. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Con Inertia:
    Inertia.visit("/catalogo/carreras");
    console.log("Cancelar y regresar");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header con fondo guinda */}
        <div className="bg-red-800 rounded-3xl p-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <FaGraduationCap className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Editar Carrera</h1>
              <p className="text-white/80 mt-2">Modifica la información de la carrera existente</p>
            </div>
          </div>
        </div>

        {/* Información actual */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-red-800 font-medium">Editando:</span>
            <span className="text-gray-700">{carrera.nombre}</span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
              {carrera.siglas}
            </span>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="space-y-6">
            {/* Campo Nombre */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Nombre del Programa Academico *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 text-gray-800 placeholder-gray-400"
                placeholder="Ej: Ingeniería en Sistemas Computacionales"
                required
                disabled={loading}
              />
            </div>

            {/* Campo Siglas */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Siglas
              </label>
              <input
                type="text"
                value={siglas}
                onChange={(e) => setSiglas(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 text-gray-800 placeholder-gray-400"
                placeholder="Ej: ISC"
                maxLength="10"
                disabled={loading}
              />
              <p className="text-xs text-gray-500">Las siglas se convertirán automáticamente a mayúsculas</p>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading || !nombre.trim()}
                className="flex-1 bg-red-800 hover:bg-red-700 disabled:bg-gray-400 text-yellow-400 hover:text-yellow-300 disabled:text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                    <span>Guardando cambios...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
              >
                <FaArrowLeft />
                <span>Cancelar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Los campos marcados con <span className="text-red-800">*</span> son obligatorios
          </p>
        </div>
      </div>
    </div>
  );
}