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
    niveles: docente?.niveles?.map(nivel => ({
      id: nivel.id, 
      nivel: nivel.nivel, 
      siglas: nivel.siglas || "",
      nombre: nivel.nombre || "",
      escuela_procedencia: nivel.escuela_procedencia || "", 
      titulo_path: nivel.titulo_path || "", 
      cedula_path: nivel.cedula_path || "", 
      titulo_file: null, 
      cedula_file: null, 
    })) || [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleNivelChange = (index, field, value) => {
    const updatedNiveles = [...form.niveles];
    updatedNiveles[index][field] = value;
    setForm({
      ...form,
      niveles: updatedNiveles,
    });
  };

  // ✅ CORREGIDO: Función addNivel con el parámetro correcto
  const addNivel = (tipo) => {
    setForm({
      ...form,
      niveles: [
        ...form.niveles,
        {
          id: null, 
          nivel: tipo, // ✅ Cambiado de 'tipoNivel' a 'tipo'
          siglas: "",
          nombre: "",
          escuela_procedencia: "",
          titulo_path: "",
          cedula_path: "",
          titulo_file: null,
          cedula_file: null,
        },
      ],
    });
  };

  // ✅ AÑADIR: Función handleFileChange que falta
  const handleFileChange = (index, field, file) => {
    const updatedNiveles = [...form.niveles];
    updatedNiveles[index][field] = file;
    setForm({
      ...form,
      niveles: updatedNiveles,
    });
  };

  const removeNivel = (index) => {
    const updated = [...form.niveles];
    updated.splice(index, 1);
    setForm({ ...form, niveles: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    // Datos básicos del docente
    formData.append("nombres", form.nombres);
    formData.append("apellido_paterno", form.apellido_paterno);
    formData.append("apellido_materno", form.apellido_materno);
    formData.append("fecha_nacimiento", form.fecha_nacimiento);
    formData.append("sexo", form.sexo);
    formData.append("rfc", form.rfc);
    formData.append("curp", form.curp);
    formData.append("email", form.email);
    formData.append("telefono", form.telefono);
    formData.append("nivel_ingles", form.nivel_ingles);
    formData.append("_method", "PUT");

    // Datos de niveles
    form.niveles.forEach((nivel, index) => {
      formData.append(`niveles[${index}][id]`, nivel.id || '');
      formData.append(`niveles[${index}][nivel]`, nivel.nivel);
      formData.append(`niveles[${index}][siglas]`, nivel.siglas);
      formData.append(`niveles[${index}][nombre]`, nivel.nombre);
      formData.append(`niveles[${index}][escuela_procedencia]`, nivel.escuela_procedencia);
      
      // Archivos nuevos
      if (nivel.titulo_file) {
        formData.append(`niveles[${index}][titulo_path]`, nivel.titulo_file);
      }
      if (nivel.cedula_file) {
        formData.append(`niveles[${index}][cedula_path]`, nivel.cedula_file);
      }
    });

    Inertia.post(`/docentes/${docente.id}`, formData, {
      forceFormData: true,
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

          {/* Lista de niveles añadidos */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Niveles de Estudio
            </h3>
            
            {/* Botones para añadir niveles */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => addNivel("Licenciatura")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
              >
                + Añadir Licenciatura
              </button>
              <button
                type="button"
                onClick={() => addNivel("Maestría")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
              >
                + Añadir Maestría
              </button>
              <button
                type="button"
                onClick={() => addNivel("Doctorado")}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500"
              >
                + Añadir Doctorado
              </button>
            </div>

            {/* Lista de niveles */}
            {form.niveles.length > 0 ? (
              form.niveles.map((nivel, index) => (
                <div key={index} className="border rounded p-4 bg-gray-50 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-lg text-gray-800">{nivel.nivel}</h4>
                    <button
                      type="button"
                      onClick={() => removeNivel(index)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-500"
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Siglas"
                      value={nivel.siglas}
                      onChange={(e) => handleNivelChange(index, "siglas", e.target.value)}
                      className="border p-2 rounded"
                    />
                    <input
                      type="text"
                      placeholder={`Nombre de la ${nivel.nivel}`}
                      value={nivel.nombre}
                      onChange={(e) => handleNivelChange(index, "nombre", e.target.value)}
                      className="border p-2 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Escuela de procedencia"
                      value={nivel.escuela_procedencia}
                      onChange={(e) => handleNivelChange(index, "escuela_procedencia", e.target.value)}
                      className="border p-2 rounded md:col-span-2"
                    />
                  </div>

                  {/* Archivos */}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título {nivel.titulo_path && "(✅ Archivo actual)"}
                      </label>
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={(e) => handleFileChange(index, "titulo_file", e.target.files[0])}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cédula {nivel.cedula_path && "(✅ Archivo actual)"}
                      </label>
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={(e) => handleFileChange(index, "cedula_file", e.target.files[0])}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 bg-gray-100 rounded">
                <p className="text-gray-600">No hay niveles de estudio agregados</p>
                <p className="text-sm text-gray-500 mt-1">Usa los botones arriba para agregar niveles</p>
              </div>
            )}
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