import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function FacilitadorForm({ capacitacion, datos_default }) {
    const [formData, setFormData] = useState({
        ...datos_default,
        lugar: datos_default.lugar || 'Santiago Papasquiaro, Durango',
        nombre_director: datos_default.nombre_director || '',
        puesto_director: datos_default.puesto_director || 'Director de Capacitación'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Usar fetch en lugar de router.post para manejar la descarga de archivos
            const response = await fetch('/capacitaciones/constancia-facilitador/generar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Obtener el blob del PDF
                const blob = await response.blob();
                
                // Crear URL temporal
                const url = window.URL.createObjectURL(blob);
                
                // Crear link de descarga
                const link = document.createElement('a');
                link.href = url;
                link.download = `constancia-facilitador-${formData.nombre_completo}-${new Date().toISOString().split('T')[0]}.pdf`;
                
                // Simular click
                document.body.appendChild(link);
                link.click();
                
                // Limpiar
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                // Opcional: Redirigir o mostrar mensaje de éxito
                // router.visit('/capacitaciones');
            } else {
                const error = await response.json();
                console.error('Error:', error);
                alert('Error al generar el PDF. Por favor intente de nuevo.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al generar el PDF. Por favor intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl font-bold text-gray-800">
                                Generar Constancia de Facilitador
                            </h1>
                            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold">
                                ID: {capacitacion.id}
                            </span>
                        </div>
                        <p className="text-gray-600">
                            Revise y edite los datos antes de generar la constancia en PDF
                        </p>
                    </div>

                    {/* Info de la Capacitación Original */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                        <h3 className="font-semibold text-blue-900 mb-2">
                            📋 Información de la Capacitación
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-blue-700 font-medium">Tipo:</span>
                                <span className="ml-2 text-gray-700">{capacitacion.tipo_curso}</span>
                            </div>
                            <div>
                                <span className="text-blue-700 font-medium">Modalidad:</span>
                                <span className="ml-2 text-gray-700">{capacitacion.modalidad}</span>
                            </div>
                            <div>
                                <span className="text-blue-700 font-medium">Tipo de Curso:</span>
                                <span className="ml-2 text-gray-700">{capacitacion.tipo}</span>
                            </div>
                            <div>
                                <span className="text-blue-700 font-medium">Autoridad:</span>
                                <span className="ml-2 text-gray-700">{capacitacion.autoridad_educativa}</span>
                            </div>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input type="hidden" name="capacitacion_id" value={formData.capacitacion_id} />

                        {/* Nombre Completo del Facilitador */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre Completo del Facilitador *
                            </label>
                            <input
                                type="text"
                                name="nombre_completo"
                                value={formData.nombre_completo}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Ej: Juan Pérez García"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Tomado del campo "Instructor" de la capacitación
                            </p>
                        </div>

                        {/* Curso */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre del Curso *
                            </label>
                            <input
                                type="text"
                                name="curso"
                                value={formData.curso}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Ej: Desarrollo de Habilidades Pedagógicas"
                            />
                        </div>

                        {/* Horas */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Duración *
                            </label>
                            <input
                                type="text"
                                name="horas"
                                value={formData.horas}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Ej: 40 horas"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Original: {capacitacion.duracion_horas} horas
                            </p>
                        </div>

                        {/* Fechas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Fecha de Inicio *
                                </label>
                                <input
                                    type="date"
                                    name="fecha_inicio"
                                    value={formData.fecha_inicio}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Fecha de Finalización *
                                </label>
                                <input
                                    type="date"
                                    name="fecha_fin"
                                    value={formData.fecha_fin}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Lugar */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Lugar *
                            </label>
                            <input
                                type="text"
                                name="lugar"
                                value={formData.lugar}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Ej: Santiago Papasquiaro, Durango"
                            />
                        </div>

                        {/* Datos del Director/Firmante */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="mr-2">✍️</span>
                                Datos del Firmante
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nombre Completo *
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre_director"
                                        value={formData.nombre_director}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="Ej: María González López"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Puesto *
                                    </label>
                                    <input
                                        type="text"
                                        name="puesto_director"
                                        value={formData.puesto_director}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="Ej: Director de Capacitación"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => router.visit('/capacitaciones')}
                                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generando PDF...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Generar Constancia
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}