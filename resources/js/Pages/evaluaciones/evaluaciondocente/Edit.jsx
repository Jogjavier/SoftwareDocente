import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

export default function Edit({ evaluacion, docentes, carreras }) {

    const [carrera_id, setCarreraId] = useState(evaluacion.carrera_id ?? "");
    const [docente_id, setDocenteId] = useState(evaluacion.docente_id ?? "");

    const [periodo, setPeriodo] = useState(evaluacion.periodo ?? "");
    const [anio, setAnio] = useState(evaluacion.anio ?? "");
    const [dominio_asignatura, setDominioAsignatura] = useState(evaluacion.dominio_asignatura ?? "");
    const [planificacion_curso, setPlanificacionCurso] = useState(evaluacion.planificacion_curso ?? "");
    const [ambiente_aprendizaje, setAmbienteAprendizaje] = useState(evaluacion.ambiente_aprendizaje ?? "");
    const [estrategias_metodos, setEstrategiasMetodos] = useState(evaluacion.estrategias_metodos ?? "");
    const [motivacion, setMotivacion] = useState(evaluacion.motivacion ?? "");
    const [evaluacion_campo, setEvaluacionCampo] = useState(evaluacion.evaluacion ?? ""); // RENOMBRADO
    const [comunicacion, setComunicacion] = useState(evaluacion.comunicacion ?? "");
    const [gestion_recurso, setGestionRecurso] = useState(evaluacion.gestion_recurso ?? "");
    const [tecnologias, setTecnologias] = useState(evaluacion.tecnologias ?? "");
    const [satisfaccion, setSatisfaccion] = useState(evaluacion.satisfaccion ?? "");
    const [resultado_global, setResultadoGlobal] = useState(evaluacion.resultado_global ?? "");

    // Cálculo del resultado global
    useEffect(() => {
        const valores = [
            dominio_asignatura,
            planificacion_curso,
            ambiente_aprendizaje,
            estrategias_metodos,
            motivacion,
            evaluacion_campo, // ACTUALIZADO
            comunicacion,
            gestion_recurso,
            tecnologias,
            satisfaccion
        ]
            .filter(val => val !== "")
            .map(Number);

        if (valores.length === 10) {
            const promedio = valores.reduce((acc, val) => acc + val, 0) / valores.length;
            setResultadoGlobal(promedio.toFixed(2));
        } else {
            setResultadoGlobal("");
        }
    }, [
        dominio_asignatura,
        planificacion_curso,
        ambiente_aprendizaje,
        estrategias_metodos,
        motivacion,
        evaluacion_campo, // ACTUALIZADO
        comunicacion,
        gestion_recurso,
        tecnologias,
        satisfaccion
    ]);

    // Filtrar docentes según carrera
    const docentesFiltrados = docentes.filter(doc => doc.carrera_id == carrera_id);

    // Envio del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/evaluaciones/evaluaciondocente/${evaluacion.id}`, {
            docente_id,
            carrera_id,
            periodo,
            anio,
            dominio_asignatura,
            planificacion_curso,
            ambiente_aprendizaje,
            estrategias_metodos,
            motivacion,
            evaluacion: evaluacion_campo, // ACTUALIZADO
            comunicacion,
            gestion_recurso,
            tecnologias,
            satisfaccion,
            resultado_global,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Encabezado */}
            <div className="bg-red-800 rounded-xl p-6 mb-8 shadow-md">
                <h1 className="text-3xl font-bold text-white text-center">
                    Editar Evaluación Docente
                </h1>
            </div>

            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-10 border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Carrera */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Carrera:</label>
                            <select
                                value={carrera_id}
                                onChange={(e) => {
                                    setCarreraId(e.target.value);
                                    setDocenteId("");
                                }}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
                                required
                            >
                                <option value="">Seleccione una carrera</option>
                                {carreras.map(carrera => (
                                    <option key={carrera.id} value={carrera.id}>
                                        {carrera.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Docente */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Docente:</label>
                            <select
                                value={docente_id}
                                onChange={(e) => setDocenteId(e.target.value)}
                                disabled={!carrera_id}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
                                required
                            >
                                <option value="">Seleccione un docente</option>
                                {docentesFiltrados.map(docente => (
                                    <option key={docente.id} value={docente.id}>
                                        {docente.nombres} {docente.apellido_paterno} {docente.apellido_materno}
                                    </option>
                                ))}
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

                        {/* Inputs numéricos */}
                        <InputNumber label="Dominio de asignatura" value={dominio_asignatura} setValue={setDominioAsignatura} />
                        <InputNumber label="Planificación del curso" value={planificacion_curso} setValue={setPlanificacionCurso} />
                        <InputNumber label="Ambiente de aprendizaje" value={ambiente_aprendizaje} setValue={setAmbienteAprendizaje} />
                        <InputNumber label="Estrategias y métodos" value={estrategias_metodos} setValue={setEstrategiasMetodos} />
                        <InputNumber label="Motivación" value={motivacion} setValue={setMotivacion} />
                        <InputNumber label="Evaluación" value={evaluacion_campo} setValue={setEvaluacionCampo} /> {/* ACTUALIZADO */}
                        <InputNumber label="Comunicación" value={comunicacion} setValue={setComunicacion} />
                        <InputNumber label="Gestión del recurso" value={gestion_recurso} setValue={setGestionRecurso} />
                        <InputNumber label="Tecnologías" value={tecnologias} setValue={setTecnologias} />
                        <InputNumber label="Satisfacción" value={satisfaccion} setValue={setSatisfaccion} />

                        {/* Resultado final */}
                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 font-semibold mb-2">Resultado Global:</label>
                            <input
                                type="text"
                                value={resultado_global}
                                readOnly
                                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-700 font-bold text-lg"
                                placeholder="Se calculará automáticamente"
                            />
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 col-span-2 mt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-red-800 text-white hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
                            >
                                Actualizar Evaluación
                            </button>

                            <button
                                type="button"
                                onClick={() => router.visit('/evaluaciones/evaluaciondocente')}
                                className="flex-1 bg-gray-300 text-gray-800 hover:bg-gray-400 px-6 py-3 rounded-lg font-semibold transition"
                            >
                                Cancelar
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}

function InputNumber({ label, value, setValue }) {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">{label}:</label>
            <input
                type="number"
                value={value}
                min="1"
                max="10"
                step="0.01"
                onChange={(e) => setValue(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
            />
        </div>
    );
}