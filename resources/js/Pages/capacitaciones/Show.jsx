import React from "react";
import { router } from "@inertiajs/react";

export default function Show({ constancia }) {
    const handleDelete = () => {
        if (confirm("¿Estás seguro de eliminar esta capacitación?")) {
            router.delete(`/capacitaciones/${constancia.id}`);
        }
    };

    const handleEdit = () => {
        router.visit(`/capacitaciones/${constancia.id}/edit`);
    };

    const handleBack = () => {
        router.visit("/capacitaciones");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="bg-red-800 rounded-xl p-6 mb-8 shadow-lg">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">
                        Detalle de Capacitación
                    </h1>
                    <button
                        onClick={handleBack}
                        className="bg-yellow-400 text-red-800 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition shadow-md"
                    >
                        ← Volver al Listado
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto">
                {/* Título y Tipo */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                {constancia.nombre}
                            </h2>
                            <div className="flex gap-3">
                                <span className={`inline-flex px-4 py-2 rounded-lg text-sm font-semibold ${
                                    constancia.tipo_curso === 'interno' 
                                        ? 'bg-blue-100 text-blue-800' 
                                        : 'bg-purple-100 text-purple-800'
                                }`}>
                                    Curso {constancia.tipo_curso?.charAt(0).toUpperCase() + constancia.tipo_curso?.slice(1)}
                                </span>
                                <span className={`inline-flex px-4 py-2 rounded-lg text-sm font-semibold ${
                                    constancia.modalidad === 'presencial' 
                                        ? 'bg-green-100 text-green-800' 
                                        : constancia.modalidad === 'virtual'
                                        ? 'bg-orange-100 text-orange-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {constancia.modalidad?.charAt(0).toUpperCase() + constancia.modalidad?.slice(1)}
                                </span>
                                <span className={`inline-flex px-4 py-2 rounded-lg text-sm font-semibold ${
                                    constancia.tipo === 'formacion' 
                                        ? 'bg-indigo-100 text-indigo-800' 
                                        : 'bg-pink-100 text-pink-800'
                                }`}>
                                    {constancia.tipo?.charAt(0).toUpperCase() + constancia.tipo?.slice(1)}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleEdit}
                                className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition shadow-md"
                            >
                                ✏️ Editar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition shadow-md"
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>

                    {/* Información general */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                        <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-1">
                                Instructor
                            </label>
                            <p className="text-lg text-gray-900">
                                {constancia.instructor || 'No especificado'}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-1">
                                Autoridad Educativa
                            </label>
                            <p className="text-lg text-gray-900">
                                {constancia.autoridad_educativa || 'No especificado'}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-1">
                                Duración
                            </label>
                            <p className="text-lg text-gray-900">
                                <span className="font-bold text-red-800">{constancia.duracion_horas}</span> horas
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-1">
                                Periodo
                            </label>
                            <p className="text-lg text-gray-900">
                                {constancia.fecha_inicio ? new Date(constancia.fecha_inicio).toLocaleDateString('es-MX', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                }) : 'N/A'}
                                {' → '}
                                {constancia.fecha_fin ? new Date(constancia.fecha_fin).toLocaleDateString('es-MX', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                }) : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Datos del curso interno */}
                {constancia.tipo_curso === 'interno' && (
                    <div className="bg-blue-50 rounded-xl shadow-lg p-8 mb-6 border-2 border-blue-200">
                        <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                            <span className="text-2xl">📋</span>
                            Información del Curso Interno
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-blue-700 mb-1">
                                    Folio / Fecha de Emisión
                                </label>
                                <p className="text-lg text-gray-900">
                                    {constancia.folio_fechaemision || 'No especificado'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-blue-700 mb-1">
                                    Horas por Módulo
                                </label>
                                <p className="text-lg text-gray-900">
                                    {constancia.modulo_horas ? `${constancia.modulo_horas} horas` : 'No especificado'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-blue-700 mb-1">
                                    Calificación del Módulo
                                </label>
                                <p className="text-lg text-gray-900">
                                    {constancia.modulo_calificacion ? (
                                        <span className={`font-bold ${
                                            constancia.modulo_calificacion >= 80 ? 'text-green-600' :
                                            constancia.modulo_calificacion >= 70 ? 'text-yellow-600' :
                                            'text-red-600'
                                        }`}>
                                            {constancia.modulo_calificacion}/100
                                        </span>
                                    ) : 'No especificado'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Docentes participantes */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="text-2xl">👥</span>
                            Docentes Participantes
                        </h3>
                        <span className="bg-red-800 text-white px-4 py-2 rounded-full font-bold">
                            {constancia.docentes?.length || 0} docente{constancia.docentes?.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {constancia.docentes && constancia.docentes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {constancia.docentes.map((docente, index) => (
                                <div 
                                    key={docente.id}
                                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="bg-red-800 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">
                                                {docente.nombres}
                                            </p>
                                            <p className="text-sm text-gray-600 truncate">
                                                {docente.apellido_paterno} {docente.apellido_materno}
                                            </p>
                                            {docente.email && (
                                                <p className="text-xs text-gray-500 mt-1 truncate">
                                                    📧 {docente.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-3">
                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500">No hay docentes asignados a esta capacitación</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}