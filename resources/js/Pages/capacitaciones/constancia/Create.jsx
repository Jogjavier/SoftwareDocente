import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function CreateConstancia() {
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [curp, setCurp] = useState("");
    const [centroAdscripcion, setCentroAdscripcion] = useState("");
    const [periodoInicio, setPeriodoInicio] = useState("");
    const [periodoFin, setPeriodoFin] = useState("");
    const [nombreCurso, setNombreCurso] = useState("");
    const [modalidad, setModalidad] = useState("");
    const [horas, setHoras] = useState("");
    const [folio, setFolio] = useState("");
    const [fechaEmision, setFechaEmision] = useState("");
    const [autoridadEducativa, setAutoridadEducativa] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        Inertia.post("/capacitaciones/constancia", {
            nombre_completo: nombreCompleto,
            curp,
            centro_adscripcion: centroAdscripcion,
            periodo_inicio: periodoInicio,
            periodo_fin: periodoFin,
            nombre_curso: nombreCurso,
            modalidad,
            horas,
            folio,
            fecha_emision: fechaEmision,
            autoridad_educativa: autoridadEducativa,
        });
    };

    return (
         <div className="min-h-screen bg-gray-50 p-6">
            {/* Encabezado */}
            <div className="bg-red-800 rounded-xl p-6 mb-8 shadow-md">
                <h1 className="text-3xl font-bold text-white text-center">
                    Registrar Constancia
                </h1>
            </div>

            {/* Formulario */}
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-10 border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Datos generales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Nombre Completo:
                            </label>
                            <input
                                type="text"
                                value={nombreCompleto}
                                onChange={(e) => setNombreCompleto(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                CURP:
                            </label>
                            <input
                                type="text"
                                value={curp}
                                onChange={(e) => setCurp(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Centro de Adscripción:
                            </label>
                            <input
                                type="text"
                                value={centroAdscripcion}
                                onChange={(e) => setCentroAdscripcion(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Periodo de Inicio:
                            </label>
                            <input
                                type="date"
                                value={periodoInicio}
                                onChange={(e) => setPeriodoInicio(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Periodo de Fin:
                            </label>
                            <input
                                type="date"
                                value={periodoFin}
                                onChange={(e) => setPeriodoFin(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Nombre del Curso:
                            </label>
                            <input
                                type="text"
                                value={nombreCurso}
                                onChange={(e) => setNombreCurso(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>
                         <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Modalidad:
                            </label>
                            <select
                                value={modalidad}
                                onChange={(e) => setModalidad(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            >
                                <option value="">Seleccionar</option>
                                <option value="Virtual">Virtual</option>
                                <option value="Presencial">Presencial</option>
                                <option value="Mixto">Mixto</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Horas:
                            </label>
                            <input
                                type="number"
                                value={horas}
                                onChange={(e) =>
                                    setHoras(e.target.value)
                                }
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Folio:
                            </label>
                            <input
                                type="text"
                                value={folio}
                                onChange={(e) => setFolio(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>
                         <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Fecha de Emisión:
                            </label>
                            <input
                                type="date"
                                value={fechaEmision}
                                onChange={(e) => setFechaEmision(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Autoridad Educativa:
                            </label>
                            <input
                                type="text"
                                value={autoridadEducativa}
                                onChange={(e) =>
                                    setAutoridadEducativa(e.target.value)
                                }
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>
                    {/* Botón */}
                    <div className="pt-6 text-center">
                        <button
                            type="submit"
                            className="bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
         </div>
    ); 
}