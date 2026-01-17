import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import Select from "react-select";

export default function Edit({ constancia, docentes = [] }) {
  const [docentesSeleccionados, setDocentesSeleccionados] = useState([]);

  const [tipoCurso, setTipoCurso] = useState(constancia.tipo_curso || "");
  const [periodo, setPeriodo] = useState(constancia.periodo || "");
  const [anio, setAnio] = useState(constancia.anio || "");
  const [nombre, setNombre] = useState(constancia.nombre || "");
  const [instructor, setInstructor] = useState(constancia.instructor || "");
  const [autoridad_educativa, setAutoridadEducativa] = useState(constancia.autoridad_educativa || "");
  const [duracion_horas, setDuracionHoras] = useState(constancia.duracion_horas || "");
  const [fecha_inicio, setFechaInicio] = useState(constancia.fecha_inicio || "");
  const [fecha_fin, setFechaFin] = useState(constancia.fecha_fin || "");
  const [tipo, setTipo] = useState(constancia.tipo || "formacion");
  const [modalidad, setModalidad] = useState(constancia.modalidad || "virtual");
  const [folio_fechaemision, setFolioFechaEmision] = useState(constancia.folio_fechaemision || "");
  const [horas_por_modulo, setHorasPorModulo] = useState(constancia.modulo_horas || "");
  const [calificacion_modulo, setCalificacionModulo] = useState(constancia.modulo_calificacion || "");

  // Cargar docentes seleccionados al inicio
  useEffect(() => {
    if (constancia.docentes && constancia.docentes.length > 0) {
      setDocentesSeleccionados(constancia.docentes.map(d => d.id));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.put(`/capacitaciones/${constancia.id}`, {
      tipo_curso: tipoCurso,
      periodo: periodo,
      anio: anio,
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            Editar Capacitación
          </h1>
          <button
            onClick={() => router.visit("/capacitaciones")}
            className="bg-yellow-400 text-red-800 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition shadow-md"
          >
            ← Volver al Listado
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-10 border border-gray-200">
        <div className="space-y-8">

          {/* TIPO DE CURSO */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tipo de curso
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
              value={tipoCurso}
              onChange={(e) => setTipoCurso(e.target.value)}
            >
              <option value="" disabled>Seleccione...</option>
              <option value="interno">Interno</option>
              <option value="externo">Externo</option>
            </select>
          </div>

          {/* Periodo */}
          <div>
              <label className="block font-semibold text-gray-700 mb-2">
                  Periodo:
              </label>
              <select
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  required
              >
                  <option value="">Seleccione el periodo</option>
                  <option value="ENE-JUN">ENE - JUN</option>
                  <option value="AGO-DIC">AGO - DIC</option>
              </select>
          </div>

          {/* Año */}
          <div>
              <label className="block font-semibold text-gray-700 mb-2">
                  Año:
              </label>
              <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
                  value={anio}
                  onChange={(e) => setAnio(e.target.value)}
                  min="2000"
                  max="2100"
                  placeholder="2024"
                  required
              />
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Nombre del Curso</label>
              <input
                type="text"
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Instructor</label>
              <input
                type="text"
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Autoridad Educativa</label>
              <input
                type="text"
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                value={autoridad_educativa}
                onChange={(e) => setAutoridadEducativa(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Docentes participantes</label>
              <Select
                isMulti
                value={docentes
                  .filter(d => docentesSeleccionados.includes(d.id))
                  .map(d => ({
                    value: d.id,
                    label: `${d.nombres} ${d.apellido_paterno} ${d.apellido_materno}`
                  }))}
                options={docentes.map(d => ({
                  value: d.id,
                  label: `${d.nombres} ${d.apellido_paterno} ${d.apellido_materno}`
                }))}
                onChange={(items) =>
                  setDocentesSeleccionados(items ? items.map(i => i.value) : [])
                }
                placeholder="Selecciona docentes"
              />
              <p className="text-sm text-gray-500">
                {docentesSeleccionados.length} docente{docentesSeleccionados.length !== 1 ? 's' : ''} seleccionado{docentesSeleccionados.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Duración (horas)</label>
              <input
                type="number"
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                value={duracion_horas}
                onChange={(e) => setDuracionHoras(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Fecha inicio</label>
                <input
                  type="date"
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                  value={fecha_inicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Fecha fin</label>
                <input
                  type="date"
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                  value={fecha_fin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Tipo</label>
                <select
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
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
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
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
            <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-4 text-lg">
                Datos del curso interno
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-700">Folio / Fecha de emisión</label>
                  <input
                    type="text"
                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={folio_fechaemision}
                    onChange={(e) => setFolioFechaEmision(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-700">Horas módulo</label>
                  <input
                    type="number"
                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={horas_por_modulo}
                    onChange={(e) => setHorasPorModulo(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-700">Calificación módulo</label>
                  <input
                    type="number"
                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={calificacion_modulo}
                    onChange={(e) => setCalificacionModulo(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-red-800 text-white hover:bg-red-700 hover:text-yellow-300 px-6 py-3 rounded-lg font-semibold transition shadow-md"
            >
              💾 Actualizar Capacitación
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-300 text-gray-800 hover:bg-gray-400 px-6 py-3 rounded-lg font-semibold transition shadow-md"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}