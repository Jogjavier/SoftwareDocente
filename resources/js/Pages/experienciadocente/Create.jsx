import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/inertia-react";

export default function Create({ docente }) {
  const [formData, setFormData] = useState({
    horas_nombramiento: "",
    presidente_academia_inicio: "",
    presidente_academia_fin: "",
    perfildeseable_fecha_inicio: "",
    perfildeseable_fecha_fin: "",
    cuerpoacademico_grado: "",
    cuerpoacademico_fecha_inicio: "",
    cuerpoacademico_fecha_fin: "",
    sni_anio: "",
    sni_nivel: "",
    investigaciones: "",
    derecho_autor: "",
    titulo: "",
    rama: "",
    tipo: "",
    revista: null, // Cambiar a null por defecto
    fecha_publicacion: "",
    nombre_articulo: "",
    link: "",
    ponencia: "",
    ponencia_inicio: "",
    ponencia_fin: "",
    instructor: "",
    instructor_inicio: "",
    instructor_fin: "",
  });

  const [perfilDeseableFile, setPerfilDeseableFile] = useState(null);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (e) => {
    setPerfilDeseableFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = new FormData();
    
    // Agregar todos los campos del formulario
    Object.keys(formData).forEach(key => {
      // Solo agregar valores que no sean vacíos o null
      if (formData[key] && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    });
    
    // Agregar archivo si existe
    if (perfilDeseableFile) {
      data.append('perfildeseable_path', perfilDeseableFile);
    }
    
    Inertia.post(`/docentes/${docente.id}/experiencias`, data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-red-800 rounded-xl p-6 mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Agregar Experiencia Docente</h1>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-red-800 mb-6">
          Docente: {docente.nombres} {docente.apellido_paterno}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Información Básica */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">Información Básica</h3>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Horas de nombramiento:
              </label>
              <select
                value={formData.horas_nombramiento}
                onChange={(e) => handleChange("horas_nombramiento", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                required
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
          </div>

          {/* Presidente de Academia */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">Presidente de Academia</h3>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Semestre de Inicio:</label>
              <input
                type="text"
                value={formData.presidente_academia_inicio}
                onChange={(e) => handleChange("presidente_academia_inicio", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="Ej: Ene-Jun 2021"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Semestre de Término:</label>
              <input
                type="text"
                value={formData.presidente_academia_fin}
                onChange={(e) => handleChange("presidente_academia_fin", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="Ej: Ago-Dic 2023"
              />
            </div>
          </div>

          {/* Perfil Deseable */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">Perfil Deseable</h3>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Perfil Deseable (PDF/Imagen):</label>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 p-3 rounded-lg"
              />
              {perfilDeseableFile && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ {perfilDeseableFile.name}
                </p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Fecha de Inicio:</label>
              <input
                type="date"
                value={formData.perfildeseable_fecha_inicio}
                onChange={(e) => handleChange("perfildeseable_fecha_inicio", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Fecha de Término:</label>
              <input
                type="date"
                value={formData.perfildeseable_fecha_fin}
                onChange={(e) => handleChange("perfildeseable_fecha_fin", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Cuerpo Académico */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">Cuerpo Académico</h3>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Grado de Cuerpo Académico:
              </label>
              <select
                value={formData.cuerpoacademico_grado}
                onChange={(e) => handleChange("cuerpoacademico_grado", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Seleccione grado de cuerpo académico</option>
                <option value="Formacion">Formación</option>
                <option value="Conclusion">Conclusión</option>
                <option value="Consolidado">Consolidado</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Fecha de Inicio:</label>
              <input
                type="date"
                value={formData.cuerpoacademico_fecha_inicio}
                onChange={(e) => handleChange("cuerpoacademico_fecha_inicio", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Fecha de Término:</label>
              <input
                type="date"
                value={formData.cuerpoacademico_fecha_fin}
                onChange={(e) => handleChange("cuerpoacademico_fecha_fin", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* SNI */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">SNI (Sistema Nacional de Investigadores)</h3>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Año de SNI:
              </label>
              <input
                type="number"
                value={formData.sni_anio}
                onChange={(e) => handleChange("sni_anio", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
                placeholder="2024"
                min="1900"
                max="2100"
              />
            </div>    
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                SNI Nivel:
              </label>
              <select
                value={formData.sni_nivel}
                onChange={(e) => handleChange("sni_nivel", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Seleccione nivel SNI</option>
                <option value="Nivel I">Nivel 1</option>
                <option value="Nivel II">Nivel 2</option>
                <option value="Emerito">Emérito</option>
              </select>
            </div>
          </div>

          {/* Investigaciones */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">Investigaciones</h3>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Investigaciones:</label>
              <textarea
                value={formData.investigaciones}
                onChange={(e) => handleChange("investigaciones", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                rows="3"
              />
            </div>
          </div>

          {/* Registro Público del Derecho de Autor */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">Registro Público del Derecho de Autor</h3>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Autor:</label>
              <input
                type="text"
                value={formData.derecho_autor}
                onChange={(e) => handleChange("derecho_autor", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Título:</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Rama:</label>
              <input
                type="text"
                value={formData.rama}
                onChange={(e) => handleChange("rama", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Publicaciones */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">Publicaciones</h3>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Tipo de Publicación:
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => handleChange("tipo", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Seleccione tipo de publicación</option>
                <option value="nacionales">Nacional</option>
                <option value="internacionales">Internacional</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Tipo de Revista:
              </label>
              <select
                value={formData.revista}
                onChange={(e) => handleChange("revista", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Seleccione tipo de revista</option>
                <option value="arbitrada">Arbitrada</option>
                <option value="indexada">Indexada</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Fecha de Publicación:</label>
              <input
                type="date"
                value={formData.fecha_publicacion}
                onChange={(e) => handleChange("fecha_publicacion", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Nombre del Artículo:</label>
              <input
                type="text"
                value={formData.nombre_articulo}
                onChange={(e) => handleChange("nombre_articulo", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Link de la Publicación:</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => handleChange("link", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="https://..."
              />
            </div>
          </div>
          {/* Ponencias */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">Ponencias</h3>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Ponencia:</label>
              <input
                type="text"
                value={formData.ponencia}
                onChange={(e) => handleChange("ponencia", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Fecha de Inicio de Ponencia:</label>
              <input
                type="date"
                value={formData.ponencia_inicio}
                onChange={(e) => handleChange("ponencia_inicio", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Fecha de Término de Ponencia:</label>
              <input
                type="date"
                value={formData.ponencia_fin}
                onChange={(e) => handleChange("ponencia_fin", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            
          </div>

          {/* Instructor */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">Cursos Impartidos</h3>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Curso:</label>
              <input 
                type="text"
                value={formData.instructor}
                onChange={(e) => handleChange("instructor", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Fecha de Inicio del Curso:</label>
              <input
                type="date"
                value={formData.instructor_inicio}
                onChange={(e) => handleChange("instructor_inicio", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Fecha de Término del Curso:</label>
              <input
                type="date"
                value={formData.instructor_fin}
                onChange={(e) => handleChange("instructor_fin", e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            
          </div>

          {/* Botones */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold transition"
            >
              Guardar experiencia
            </button>
            <Link
              href={`/docentes/${docente.id}`}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold text-center flex items-center justify-center transition"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}