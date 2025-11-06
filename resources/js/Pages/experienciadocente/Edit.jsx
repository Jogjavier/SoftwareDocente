import React, { useState } from "react";
import { FaBriefcase, FaSave, FaArrowLeft } from "react-icons/fa";
import { Inertia } from "@inertiajs/inertia";

export default function EditExperiencia({ docente, experiencia, carreras = [] }) {
  const [form, setForm] = useState({
    horas_nombramiento: experiencia?.horas_nombramiento || "",
    presidente_academia_inicio: experiencia?.presidente_academia_inicio || "",
    presidente_academia_fin: experiencia?.presidente_academia_fin || "",
    perfildeseable_fecha_inicio: experiencia?.perfildeseable_fecha_inicio || "",
    perfildeseable_fecha_fin: experiencia?.perfildeseable_fecha_fin || "",
    perfildeseable_path: experiencia?.perfildeseable_path || "",
    perfildeseable_file: null,
    cuerpoacademico_grado: experiencia?.cuerpoacademico_grado || "",
    cuerpoacademico_fecha_inicio: experiencia?.cuerpoacademico_fecha_inicio || "",
    cuerpoacademico_fecha_fin: experiencia?.cuerpoacademico_fecha_fin || "",
    sni_anio: experiencia?.sni_anio || "",
    sni_nivel: experiencia?.sni_nivel || "",
    investigaciones: experiencia?.investigaciones || "",
    derecho_autor: experiencia?.derecho_autor || "",
    titulo: experiencia?.titulo || "",
    rama: experiencia?.rama || "",
    tipo: experiencia?.tipo || "",
    revista: experiencia?.revista || "",
    fecha_publicacion: experiencia?.fecha_publicacion || "",
    nombre_articulo: experiencia?.nombre_articulo || "",
    link: experiencia?.link || "",
    ponencia: experiencia?.ponencia || "",
    ponencia_inicio: experiencia?.ponencia_inicio || "",
    ponencia_fin: experiencia?.ponencia_fin || "",
    instructor: experiencia?.instructor || "",
    instructor_inicio: experiencia?.instructor_inicio || "",
    instructor_fin: experiencia?.instructor_fin || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      perfildeseable_file: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    // Agregar todos los campos
    Object.keys(form).forEach((key) => {
      if (key !== "perfildeseable_file" && key !== "perfildeseable_path") {
        formData.append(key, form[key] || "");
      }
    });

    // Agregar archivo si existe
    if (form.perfildeseable_file) {
      formData.append("perfildeseable_path", form.perfildeseable_file);
    }

    formData.append("_method", "PUT");

    Inertia.post(
      `/docentes/${docente.id}/experiencias/${experiencia.id}`,
      formData,
      {
        forceFormData: true,
        onFinish: () => setLoading(false),
      }
    );
  };

  const handleCancel = () => {
    Inertia.visit(`/docentes/${docente.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-red-800 rounded-3xl p-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <FaBriefcase className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Editar Experiencia Docente
              </h1>
              <p className="text-white/80 mt-2">
                {docente.nombres} {docente.apellido_paterno}{" "}
                {docente.apellido_materno}
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 space-y-8"
        >
          {/* Información General */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-red-800 mb-6">
              Información General
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Horas de Nombramiento
                </label>
                <select
                  name="horas_nombramiento"
                  value={form.horas_nombramiento || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                  disabled={loading}
                >
                  <option value="">Seleccione horas de nombramiento</option>
                  <option value="Tiempo Completo">Tiempo Completo</option>
                  <option value="Medio Tiempo">Medio Tiempo</option>
                  <option value="Tres Cuartos de Tiempo">Tres Cuartos de Tiempo</option>
                  <option value="Asignaturas">Asignaturas</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Directivo">Directivo</option>
                  <option value="No Capturado">No Capturado</option>
              </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Presidente Academia (Inicio)
                </label>
                <input
                  type="text"
                  name="presidente_academia_inicio"
                  value={form.presidente_academia_inicio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Presidente Academia (Fin)
                </label>
                <input
                  type="text"
                  name="presidente_academia_fin"
                  value={form.presidente_academia_fin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Perfil Deseable */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">
              Perfil Deseable
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  name="perfildeseable_fecha_inicio"
                  value={form.perfildeseable_fecha_inicio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  name="perfildeseable_fecha_fin"
                  value={form.perfildeseable_fecha_fin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Documento{" "}
                  {form.perfildeseable_path && "(✅ Archivo actual)"}
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border rounded-lg"
                  disabled={loading}
                />
                {form.perfildeseable_path && (
                  <a
                    href={`/storage/${form.perfildeseable_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                  >
                    Ver documento actual
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Cuerpo Académico */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-6">
              Cuerpo Académico
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Grado
                </label>
                <select
                  name="cuerpoacademico_grado"
                  value={form.cuerpoacademico_grado || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                  disabled={loading}
                >
                <option value="">Seleccione grado de cuerpo académico</option>
                <option value="Formacion">Formación</option>
                <option value="Conclusion">Conclusión</option>
                <option value="Consolidado">Consolidado</option>
              </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  name="cuerpoacademico_fecha_inicio"
                  value={form.cuerpoacademico_fecha_inicio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  name="cuerpoacademico_fecha_fin"
                  value={form.cuerpoacademico_fecha_fin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* SNI */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-6">
              Sistema Nacional de Investigadores (SNI)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Año
                </label>
                <input
                  type="number"
                  name="sni_anio"
                  value={form.sni_anio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nivel
                </label>
                <select
                  name="sni_nivel"
                  value={form.sni_nivel || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                  disabled={loading}
                >
                <option value="">Seleccione nivel SNI</option>
                <option value="Nivel I">Nivel I</option>
                <option value="Nivel II">Nivel II</option>
                <option value="Emerito">Emérito</option>
              </select>
              </div>
            </div>
          </div>

          {/* Investigaciónes */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-yellow-800 mb-6">
              Investigaciónes
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Investigaciones:
                </label>
                <textarea
                  name="investigaciones"
                  value={form.investigaciones}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

           {/* Derecho de Autor */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-yellow-800 mb-6">
              Registro Publico de Derecho de Autor
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Autor:
                </label>
                <input
                  type="text"
                  name="autor"
                  value={form.autor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Titulo:
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rama:
                </label>
                <input
                  type="text"
                  name="rama"
                  value={form.rama}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Publicación */}
          <div>
            <h2 className="text-2xl font-bold text-red-800 mb-6">
              Publicación
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  name="tipo"
                  value={form.tipo || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                  disabled={loading}
                >
                <option value="">Seleccione tipo de publicación</option>
                <option value="nacionales">Nacional</option>
                <option value="internacionales">Internacional</option>
              </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Revista
                </label>
                <select
                  name="revista"
                  value={form.revista || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                  disabled={loading}
                >
                <option value="">Seleccione tipo de revista</option>
                <option value="arbitrada">Arbitrada</option>
                <option value="indexada">Indexada</option>
              </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Publicación
                </label>
                <input
                  type="date"
                  name="fecha_publicacion"
                  value={form.fecha_publicacion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Artículo
                </label>
                <input
                  type="text"
                  name="nombre_articulo"
                  value={form.nombre_articulo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enlace
                </label>
                <input
                  type="url"
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          { /* Ponencias */}
          <div>
            <h2 className="text-2xl font-bold text-red-800 mb-6">
              Ponencias
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ponencia
                </label>
                <input
                  type="text"
                  name="ponencia"
                  value={form.ponencia}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Inicio de Ponencia:
                </label>
                <input
                  type="date"
                  name="ponencia_inicio"
                  value={form.ponencia_inicio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Fin de Ponencia:
                </label>
                <input
                  type="date"
                  name="ponencia_fin"
                  value={form.ponencia_fin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          { /* Instructor de curso */}
          <div>
            <h2 className="text-2xl font-bold text-red-800 mb-6">
              Cursos Impartidos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Curso:
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={form.instructor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Inicio del Curso:
                </label>
                <input
                  type="date"
                  name="instructor_inicio"
                  value={form.instructor_inicio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Fin del Curso:
                </label>
                <input
                  type="date"
                  name="instructor_fin"
                  value={form.instructor_fin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
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