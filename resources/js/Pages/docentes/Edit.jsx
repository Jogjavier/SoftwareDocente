import React, { useState } from "react";
import { FaGraduationCap, FaSave, FaArrowLeft } from "react-icons/fa";
import { Inertia } from "@inertiajs/inertia";

export default function Edit({ docente }) {
  const [form, setForm] = useState({
    nombres: docente?.nombres || "",
    apellido_paterno: docente?.apellido_paterno || "",
    apellido_materno: docente?.apellido_materno || "",
    fecha_nacimiento: docente?.fecha_nacimiento || "",
    sexo: docente?.sexo || "M",
    rfc: docente?.rfc || "",
    curp: docente?.curp || "",
    email: docente?.email || "",
    telefono: docente?.telefono || "",
    nivel_ingles: docente?.nivel_ingles || "Bajo",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    Inertia.put(`/docentes/${docente.id}`, form, {
      onFinish: () => setLoading(false),
    });
  };

  const handleCancel = () => {
    Inertia.visit("/docentes/index");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-red-800 rounded-3xl p-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <FaGraduationCap className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Editar Docente</h1>
              <p className="text-white/80 mt-2">
                Modifica la información del docente seleccionado
              </p>
            </div>
          </div>
        </div>

        {/* Información actual */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-red-800 font-medium">Editando:</span>
            <span className="text-gray-700">
              {docente.nombres} {docente.apellido_paterno} {docente.apellido_materno}
            </span>
          </div>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 space-y-6"
        >
          {/* Nombres */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Nombre(s) *
            </label>
            <input
              type="text"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
              disabled={loading}
            />
          </div>

          {/* Apellido Paterno */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Apellido Paterno *
            </label>
            <input
              type="text"
              name="apellido_paterno"
              value={form.apellido_paterno}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
              disabled={loading}
            />
          </div>

          {/* Apellido Materno */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Apellido Materno
            </label>
            <input
              type="text"
              name="apellido_materno"
              value={form.apellido_materno}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={loading}
            />
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Fecha de Nacimiento *
            </label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
              disabled={loading}
            />
          </div>

          {/* Sexo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Sexo *
            </label>
            <select
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={loading}
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          {/* RFC */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              RFC *
            </label>
            <input
              type="text"
              name="rfc"
              value={form.rfc}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
              disabled={loading}
            />
          </div>

          {/* CURP */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              CURP *
            </label>
            <input
              type="text"
              name="curp"
              value={form.curp}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Correo Electrónico *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
              disabled={loading}
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={loading}
            />
          </div>

          {/* Nivel de inglés */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Nivel de Inglés *
            </label>
            <select
              name="nivel_ingles"
              value={form.nivel_ingles}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={loading}
            >
              <option value="Bajo">Bajo</option>
              <option value="Medio">Medio</option>
              <option value="Alto">Alto</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-800 hover:bg-red-700 disabled:bg-gray-400 text-yellow-400 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                  <span>Guardando...</span>
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
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Los campos marcados con <span className="text-red-800">*</span> son
            obligatorios
          </p>
        </div>
      </div>
    </div>
  );
}
