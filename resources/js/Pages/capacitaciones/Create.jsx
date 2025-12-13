import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

export default function Create() {
  const { docentes } = usePage().props;

  const [tipoCurso, setTipoCurso] = useState("");
  const [nombre, setNombre] = useState("");
  const [instructor, setInstructor] = useState("");
  const [autoridad_educativa, setAutoridadEducativa] = useState("");
  const [docente_id, setDocenteId] = useState("");
  const [duracion_horas, setDuracionHoras] = useState("");
  const [fecha_inicio, setFechaInicio] = useState("");
  const [fecha_fin, setFechaFin] = useState("");
  const [tipo, setTipo] = useState("");
  const [modalidad, setModalidad] = useState("");
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
              docente_id,
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

          {/* CAMPOS COMUNES */}
          <div className="block text-gray-700 font-semibold mb-2">
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Nombre</label>
              <input type="text" className="border p-2 rounded" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold">Instructor</label>
              <input type="text" className="border p-2 rounded" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold">Docente</label>
              <select className="border p-2 rounded">
                <option>Seleccione docente</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold">Duración (horas)</label>
              <input type="number" className="border p-2 rounded" />
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
                  <label className="font-semibold">Tipo</label>
                  <select className="border p-2 rounded">
                    <option value="formacion">Formación</option>
                    <option value="actualizacion">Actualización</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Modalidad</label>
                  <select className="border p-2 rounded">
                    <option value="virtual">Virtual</option>
                    <option value="presencial">Presencial</option>
                    <option value="mixto">Mixto</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Horas por módulo</label>
                  <input type="number" className="border p-2 rounded" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Calificación del módulo</label>
                  <input type="number" className="border p-2 rounded" />
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-4 col-span-1 md:col-span-2 mt-4">
              <button
                type="submit"
                className="flex-1 bg-red-800 text-yellow-400 hover:bg-red-700 hover:text-yellow-300 px-6 py-3 rounded-lg font-semibold transition"
              >
                Guardar Evaluación
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 bg-gray-300 text-gray-800 hover:bg-gray-400 px-6 py-3 rounded-lg font-semibold transition"
              >
                Cancelar
              </button>
            </div>
        </form>
      </div>
    </div>
  );
}
