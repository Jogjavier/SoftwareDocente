import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import Select from "react-select";

export default function Create({ docentes = [] }) {
  const [docentesSeleccionados, setDocentesSeleccionados] = useState([]);

  const [tipoCurso, setTipoCurso] = useState("");
  const [nombre, setNombre] = useState("");
  const [instructor, setInstructor] = useState("");
  const [autoridad_educativa, setAutoridadEducativa] = useState("");
  const [duracion_horas, setDuracionHoras] = useState("");
  const [fecha_inicio, setFechaInicio] = useState("");
  const [fecha_fin, setFechaFin] = useState("");
  const [tipo, setTipo] = useState("formacion"); // ✅ Valor por defecto
  const [modalidad, setModalidad] = useState("virtual"); // ✅ Valor por defecto
  const [folio_fechaemision, setFolioFechaEmision] = useState("");
  const [horas_por_modulo, setHorasPorModulo] = useState("");
  const [calificacion_modulo, setCalificacionModulo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    Inertia.post("/capacitaciones", {
      tipo_curso: tipoCurso,
      nombre,
      instructor,
      autoridad_educativa,
      docente_ids: docentesSeleccionados,
      duracion_horas,
      fecha_inicio,
      fecha_fin,
      tipo,
      modalidad,
      folio_fechaemision,
      modulo_horas: horas_por_modulo,
      modulo_calificacion: calificacion_modulo
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Encabezado */}
      <div className="bg-red-800 rounded-xl p-6 mb-8 shadow-md">
        <h1 className="text-3xl font-bold text-white text-center">
          Registrar Capacitación
        </h1>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-10 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* TIPO DE CURSO */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tipo de curso
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
              value={tipoCurso}
              onChange={(e) => setTipoCurso(e.target.value)}
            >
              <option value="" disabled>Seleccione...</option>
              <option value="interno">Interno</option>
              <option value="externo">Externo</option>
            </select>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Nombre del Curso</label>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Instructor</label>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Autoridad Educativa</label>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500"
                value={autoridad_educativa}
                onChange={(e) => setAutoridadEducativa(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Docentes participantes</label>
              <Select
                isMulti
                options={docentes.map(d => ({
                  value: d.id,
                  label: `${d.nombres} ${d.apellido_paterno} ${d.apellido_materno}`
                }))}
                onChange={(items) =>
                  setDocentesSeleccionados(items.map(i => i.value))
                }
                placeholder="Selecciona docentes"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Duración (horas)</label>
              <input
                type="number"
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500"
                value={duracion_horas}
                onChange={(e) => setDuracionHoras(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Fecha inicio</label>
                <input
                  type="date"
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500"
                  value={fecha_inicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Fecha fin</label>
                <input
                  type="date"
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500"
                  value={fecha_fin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Tipo</label>
                <select
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="formacion">Formación</option>
                  <option value="actualizacion">Actualización</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Modalidad</label>
                <select
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500"
                  value={modalidad}
                  onChange={(e) => setModalidad(e.target.value)}
                >
                  <option value="virtual">Virtual</option>
                  <option value="presencial">Presencial</option>
                  <option value="mixto">Mixto</option>
                </select>
              </div>
            </div>
          </div>

          {/* CAMPOS SOLO PARA INTERNO */}
          {tipoCurso === "interno" && (
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-4">
                Datos del curso interno
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-700">Folio / Fecha de emisión</label>
                  <input
                    type="date"
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500"
                    value={folio_fechaemision}
                    onChange={(e) => setFolioFechaEmision(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-700">Horas módulo</label>
                  <input
                    type="number"
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500"
                    value={horas_por_modulo}
                    onChange={(e) => setHorasPorModulo(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-700">Calificación módulo</label>
                  <input
                    type="number"
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500"
                    value={calificacion_modulo}
                    onChange={(e) => setCalificacionModulo(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="flex-1 bg-red-800 text-yellow-400 hover:bg-red-700 hover:text-yellow-300 px-6 py-3 rounded-lg font-semibold transition shadow-md"
            >
              Guardar Capacitación
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-300 text-gray-800 hover:bg-gray-400 px-6 py-3 rounded-lg font-semibold transition shadow-md"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}