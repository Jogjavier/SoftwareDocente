import { useState } from "react";
import { router } from "@inertiajs/react";

export default function CreateCursoExterno({ docentes }) {
    const [nombre, setNombre] = useState("");
    const [instructor, setInstructor] = useState("");
    const [autoridadEducativa, setAutoridadEducativa] = useState("");
    const [docentesSeleccionados, setDocentesSeleccionados] = useState([]);
    const [duracionHoras, setDuracionHoras] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [tipo, setTipo] = useState("");
    const [modalidad, setModalidad] = useState("");
    const [errors, setErrors] = useState({});

    const handleDocenteToggle = (docenteId) => {
        if (docentesSeleccionados.includes(docenteId)) {
            setDocentesSeleccionados(docentesSeleccionados.filter(id => id !== docenteId));
        } else {
            setDocentesSeleccionados([...docentesSeleccionados, docenteId]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación básica antes de enviar
        if (docentesSeleccionados.length === 0) {
            alert('Debes seleccionar al menos un docente');
            return;
        }

        const data = {
            nombre,
            instructor,
            autoridad_educativa: autoridadEducativa,
            docentes: docentesSeleccionados,
            duracion_horas: parseInt(duracionHoras),
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            tipo,
            modalidad,
        };

        console.log('Enviando datos:', data); // Para debug

        router.post('/capacitaciones/cursoexterno', data, {
            onSuccess: () => {
                console.log('Curso externo creado exitosamente');
            },
            onError: (errors) => {
                console.error('Errores de validación:', errors);
                setErrors(errors);
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Encabezado */}
            <div className="bg-red-800 rounded-xl p-6 mb-8 shadow-md">
                <h1 className="text-3xl font-bold text-white text-center">
                    Registrar Curso Externo
                </h1>
            </div>

            {/* Formulario */}
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-10 border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Datos generales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Nombre del Curso:
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                            {errors.nombre && (
                                <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Instructor:
                            </label>
                            <input
                                type="text"
                                value={instructor}
                                onChange={(e) => setInstructor(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                            {errors.instructor && (
                                <p className="text-red-600 text-sm mt-1">{errors.instructor}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Autoridad Educativa:
                            </label>
                            <input
                                type="text"
                                value={autoridadEducativa}
                                onChange={(e) => setAutoridadEducativa(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                            {errors.autoridad_educativa && (
                                <p className="text-red-600 text-sm mt-1">{errors.autoridad_educativa}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Duración (horas):
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={duracionHoras}
                                onChange={(e) => setDuracionHoras(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                            {errors.duracion_horas && (
                                <p className="text-red-600 text-sm mt-1">{errors.duracion_horas}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Fecha de Inicio:
                            </label>
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                            {errors.fecha_inicio && (
                                <p className="text-red-600 text-sm mt-1">{errors.fecha_inicio}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Fecha de Fin:
                            </label>
                            <input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                min={fechaInicio}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                            {errors.fecha_fin && (
                                <p className="text-red-600 text-sm mt-1">{errors.fecha_fin}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">
                                Tipo:
                            </label>
                            <select
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            >
                                <option value="">Seleccionar</option>
                                <option value="formacion">Formación</option>
                                <option value="actualizacion">Actualización</option>
                            </select>
                            {errors.tipo && (
                                <p className="text-red-600 text-sm mt-1">{errors.tipo}</p>
                            )}
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
                                <option value="virtual">Virtual</option>
                                <option value="presencial">Presencial</option>
                                <option value="mixto">Mixto</option>
                            </select>
                            {errors.modalidad && (
                                <p className="text-red-600 text-sm mt-1">{errors.modalidad}</p>
                            )}
                        </div>
                    </div>

                    {/* Sección de Docentes */}
                    <div className="border-t pt-6">
                        <label className="block mb-4 text-gray-700 font-medium text-lg">
                            Docentes Participantes: 
                            <span className="text-sm text-gray-500 ml-2">
                                ({docentesSeleccionados.length} seleccionados)
                            </span>
                        </label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                            {docentes && docentes.length > 0 ? (
                                docentes.map((docente) => (
                                    <label
                                        key={docente.id}
                                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white cursor-pointer transition-colors border border-transparent hover:border-red-200"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={docentesSeleccionados.includes(docente.id)}
                                            onChange={() => handleDocenteToggle(docente.id)}
                                            className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                        />
                                        <span className="text-gray-700">
                                            {docente.nombre_completo}
                                        </span>
                                    </label>
                                ))
                            ) : (
                                <p className="text-gray-500 col-span-3 text-center py-4">
                                    No hay docentes disponibles
                                </p>
                            )}
                        </div>

                        {docentesSeleccionados.length === 0 && (
                            <p className="text-red-600 text-sm mt-2">
                                * Debes seleccionar al menos un docente
                            </p>
                        )}
                        {errors.docentes && (
                            <p className="text-red-600 text-sm mt-2">{errors.docentes}</p>
                        )}
                    </div>

                    {/* Botón */}
                    <div className="pt-6 text-center">
                        <button
                            type="submit"
                            disabled={docentesSeleccionados.length === 0}
                            className="bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Registrar Curso Externo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}