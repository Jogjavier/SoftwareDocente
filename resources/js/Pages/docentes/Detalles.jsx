import React, { useState } from "react";
import { router, Link } from "@inertiajs/react";

export default function Detalles({ docente, experiencias = [] }) {
  const [showExperiencias, setShowExperiencias] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-red-800 rounded-xl p-6 mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Detalles del Docente</h1>
        <button
          onClick={() => router.visit("/docentes/index")}
          className="bg-yellow-400 text-red-800 px-4 py-2 rounded font-semibold hover:bg-yellow-300"
        >
          Regresar
        </button>
      </div>

      {/* Tarjeta con detalles */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200 mb-6">
        <h2 className="text-2xl font-bold text-red-800 mb-6">
          {docente.nombres} {docente.apellido_paterno} {docente.apellido_materno}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 font-semibold">Fecha de Nacimiento:</p>
            <p className="text-gray-800">{docente.fecha_nacimiento}</p>
          </div>

          <div>
            <p className="text-gray-600 font-semibold">Sexo:</p>
            <p className="text-gray-800">{docente.sexo}</p>
          </div>

          <div>
            <p className="text-gray-600 font-semibold">RFC:</p>
            <p className="text-gray-800">{docente.rfc}</p>
          </div>

          <div>
            <p className="text-gray-600 font-semibold">CURP:</p>
            <p className="text-gray-800">{docente.curp}</p>
          </div>

          <div>
            <p className="text-gray-600 font-semibold">Correo Electrónico:</p>
            <p className="text-gray-800">{docente.email}</p>
          </div>

          <div>
            <p className="text-gray-600 font-semibold">Teléfono:</p>
            <p className="text-gray-800">{docente.telefono}</p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-gray-600 font-semibold">Nivel de Inglés:</p>
            <p className="text-gray-800">{docente.nivel_ingles}</p>
          </div>

          <div>
            <p className="text-gray-600 font-semibold">Año de Ingreso:</p>
            <p className="text-gray-800">{docente.anio_ingreso}</p>
          </div>

          <div>
            <p className="text-gray-600 font-semibold">Departamento al que pertenece:</p>
            <p className="text-gray-800">{docente.carrera?.nombre || "Sin asignar"}</p>
          </div>

          <div className="sm:col-span-2">
            <h3 className="text-xl font-bold text-red-800 mb-4">Niveles de Estudio</h3>
            {docente.niveles && docente.niveles.length > 0 ? (
              <div className="space-y-4">
                {docente.niveles.map((nivel, index) => (
                  <div key={index} className="border p-4 rounded-lg bg-gray-50">
                    <p className="text-gray-600 font-semibold">Nivel:</p>
                    <p className="text-gray-800">{nivel.nivel}</p>

                    <p className="text-gray-600 font-semibold">Siglas:</p>
                    <p className="text-gray-800">{nivel.siglas}</p>

                    <p className="text-gray-600 font-semibold">Nombre:</p>
                    <p className="text-gray-800">{nivel.nombre}</p>

                    <p className="text-gray-600 font-semibold">Escuela de Procedencia:</p>
                    <p className="text-gray-800">{nivel.escuela_procedencia}</p>

                    <p className="text-gray-600 font-semibold">Número de Cédula:</p>
                    <p className="text-gray-800">{nivel.cedula}</p>

                    {nivel.titulo_path && (
                      <>
                        <p className="text-gray-600 font-semibold">Título:</p>
                          <a
                          href={`/storage/${nivel.titulo_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                          >
                          Ver título
                        </a>
                      </>
                    )}

                    {nivel.cedula_path && (
                        <>
                        <p className="text-gray-600 font-semibold">Cédula:</p>
                          <a
                          href={`/storage/${nivel.cedula_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                          >
                          Ver cédula
                        </a>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No hay niveles de estudio disponibles.</p>
            )}
          </div>
        </div>
      </div>

      {/* Sección de experiencias docentes */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-red-800">
            Experiencias Docentes
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowExperiencias(!showExperiencias)}
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
            >
              {showExperiencias ? "Ocultar Experiencias" : "Ver Experiencias"}
            </button>

            <Link
              href={route("docentes.experiencias.create", docente.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
            >
              + Agregar Experiencia
            </Link>
          </div>
        </div>

        {showExperiencias && (
          experiencias.length > 0 ? (
            <div className="space-y-6">
              {experiencias.map((exp) => (
                <div key={exp.id} className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                  {/* Header de la experiencia */}
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-300">
                    <div className="flex gap-2">
                      <Link
                        href={route("docentes.experiencias.edit", [docente.id, exp.id])}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Editar
                      </Link>
                      <Link
                        href={route("docentes.experiencias.destroy", [docente.id, exp.id])}
                        method="delete"
                        as="button"
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        onClick={(e) => {
                          if (!confirm("¿Seguro que deseas eliminar esta experiencia?")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Eliminar
                      </Link>
                    </div>
                  </div>

                  {/* Información general */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 font-semibold text-sm">Horas de Nombramiento:</p>
                      <p className="text-gray-800">{exp.horas_nombramiento || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold text-sm">Presidente Academia (Inicio):</p>
                      <p className="text-gray-800">{exp.presidente_academia_inicio || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold text-sm">Presidente Academia (Fin):</p>
                      <p className="text-gray-800">{exp.presidente_academia_fin || "N/A"}</p>
                    </div>
                  </div>

                  {/* Perfil Deseable */}
                  {(exp.perfildeseable_path || exp.perfildeseable_fecha_inicio || exp.perfildeseable_fecha_fin) && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-bold text-blue-800 mb-2">Perfil Deseable</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {exp.perfildeseable_fecha_inicio && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Fecha Inicio:</p>
                            <p className="text-gray-800">{exp.perfildeseable_fecha_inicio}</p>
                          </div>
                        )}
                        {exp.perfildeseable_fecha_fin && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Fecha Fin:</p>
                            <p className="text-gray-800">{exp.perfildeseable_fecha_fin}</p>
                          </div>
                        )}
                        {exp.perfildeseable_path && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Documento:</p>
                            <a
                              href={`/storage/${exp.perfildeseable_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Ver documento
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cuerpo Académico */}
                  {(exp.cuerpoacademico_grado || exp.cuerpoacademico_fecha_inicio || exp.cuerpoacademico_fecha_fin) && (
                    <div className="mb-4 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-bold text-green-800 mb-2">Cuerpo Académico</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {exp.cuerpoacademico_grado && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Grado:</p>
                            <p className="text-gray-800">{exp.cuerpoacademico_grado}</p>
                          </div>
                        )}
                        {exp.cuerpoacademico_fecha_inicio && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Fecha Inicio:</p>
                            <p className="text-gray-800">{exp.cuerpoacademico_fecha_inicio}</p>
                          </div>
                        )}
                        {exp.cuerpoacademico_fecha_fin && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Fecha Fin:</p>
                            <p className="text-gray-800">{exp.cuerpoacademico_fecha_fin}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SNI */}
                  {(exp.sni_anio || exp.sni_nivel) && (
                    <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-bold text-purple-800 mb-2">Sistema Nacional de Investigadores (SNI)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {exp.sni_anio && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Año:</p>
                            <p className="text-gray-800">{exp.sni_anio}</p>
                          </div>
                        )}
                        {exp.sni_nivel && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Nivel:</p>
                            <p className="text-gray-800">{exp.sni_nivel}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Investigaciones */}
                  {(exp.investigaciones) && (
                    <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-bold text-yellow-800 mb-2">Investigaciónes</h4>
                      {exp.investigaciones && (
                        <div className="mb-3">
                          <p className="text-gray-600 font-semibold text-sm">Investigaciones:</p>
                          <p className="text-gray-800">{exp.investigaciones}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Derechos de Autor */}
                  {(exp.derecho_autor) && (
                    <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-bold text-yellow-800 mb-2">Registro Público de Derecho de Autor</h4>
                      {exp.derecho_autor && (
                        <div>
                          <p className="text-gray-600 font-semibold text-sm">Autor:</p>
                          <p className="text-gray-800">{exp.derecho_autor}</p>
                        </div>
                      )}
                      {exp.titulo && (
                        <div>
                          <p className="text-gray-600 font-semibold text-sm">Titulo:</p>
                          <p className="text-gray-800">{exp.titulo}</p>
                        </div>
                      )}
                      {exp.rama && (
                        <div>
                          <p className="text-gray-600 font-semibold text-sm">Rama:</p>
                          <p className="text-gray-800">{exp.rama}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Publicación */}
                  {(exp.tipo || exp.revista || exp.fecha_publicacion || exp.nombre_articulo || exp.link) && (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-bold text-red-800 mb-2">Publicación</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {exp.tipo && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Tipo:</p>
                            <p className="text-gray-800">{exp.tipo}</p>
                          </div>
                        )}
                        {exp.revista && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Revista:</p>
                            <p className="text-gray-800">{exp.revista}</p>
                          </div>
                        )}
                        {exp.fecha_publicacion && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Fecha de Publicación:</p>
                            <p className="text-gray-800">{exp.fecha_publicacion}</p>
                          </div>
                        )}
                        {exp.nombre_articulo && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Nombre del Artículo:</p>
                            <p className="text-gray-800">{exp.nombre_articulo}</p>
                          </div>
                        )}
                        {exp.link && (
                          <div className="md:col-span-2">
                            <p className="text-gray-600 font-semibold text-sm">Enlace:</p>
                            <a
                              href={exp.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {exp.link}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Ponencias */}
                  {(exp.ponencia || exp.ponencia_inicio || exp.ponencia_fin) && (
                    <div className="mt-4 p-4 bg-teal-50 rounded-lg">
                      <h4 className="font-bold text-teal-800 mb-2">Ponencias</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {exp.ponencia && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Ponencia:</p>
                            <p className="text-gray-800">{exp.ponencia}</p>
                          </div>
                        )}
                        {exp.ponencia_inicio && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Fecha de Inicio de la Ponencia:</p>
                            <p className="text-gray-800">{exp.ponencia_inicio}</p>
                          </div>
                        )}
                        {exp.ponencia_fin && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Fecha de Fin de la Ponencia:</p>
                            <p className="text-gray-800">{exp.ponencia_fin}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Instructor de Curso */}
                  {(exp.instructor || exp.instructor_inicio || exp.instructor_fin) && (
                    <div className="mt-4 p-4 bg-teal-50 rounded-lg">
                      <h4 className="font-bold text-teal-800 mb-2">Cursos Impartidos</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {exp.instructor && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Curso:</p>
                            <p className="text-gray-800">{exp.instructor}</p>
                          </div>
                        )}
                        {exp.instructor_inicio && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Fecha de Inicio del Curso:</p>
                            <p className="text-gray-800">{exp.instructor_inicio}</p>
                          </div>
                        )}
                        {exp.instructor_fin && (
                          <div>
                            <p className="text-gray-600 font-semibold text-sm">Fecha de Fin del Curso:</p>
                            <p className="text-gray-800">{exp.instructor_fin}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No hay experiencias docentes registradas.</p>
          )
        )}
      </div>
    </div>
  );
}