import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function DocentesForm({ capacitacion, datos_default, docentes }) {
    const [formData, setFormData] = useState({
        capacitacion_id: capacitacion.id,
        curso: datos_default.curso || capacitacion.nombre,
        horas: datos_default.horas || capacitacion.duracion_horas + ' horas',
        fecha_inicio: datos_default.fecha_inicio || capacitacion.fecha_inicio,
        fecha_fin: datos_default.fecha_fin || capacitacion.fecha_fin,
        lugar: datos_default.lugar || 'Sombrerete, Zacatecas',
        nombre_director: datos_default.nombre_director || '',
        puesto_director: datos_default.puesto_director || 'DIRECTORA GENERAL',
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
            console.log('Enviando datos:', formData);
            
            const response = await fetch('/capacitaciones/constancia-docentes/generar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Accept': 'application/zip',
                },
                body: JSON.stringify(formData),
            });

            console.log('Status de respuesta:', response.status);

            if (response.ok) {
                // Obtener el blob del ZIP
                const blob = await response.blob();
                console.log('Blob recibido:', blob.size, 'bytes');
                
                // Crear URL temporal
                const url = window.URL.createObjectURL(blob);
                
                // Crear link de descarga
                const link = document.createElement('a');
                link.href = url;
                link.download = `constancias-docentes-capacitacion-${formData.capacitacion_id}-${new Date().toISOString().split('T')[0]}.zip`;
                
                // Simular click
                document.body.appendChild(link);
                link.click();
                
                // Limpiar
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                // Mostrar mensaje de éxito
                alert(`¡Constancias generadas exitosamente! Se generaron ${docentes?.length || 0} constancias en el archivo ZIP.`);
                
                // Opcional: Redirigir después de 2 segundos
                setTimeout(() => {
                    router.visit('/capacitaciones');
                }, 2000);
            } else {
                // Intentar leer el error como JSON
                const contentType = response.headers.get('content-type');
                let errorMessage = 'Error desconocido';
                
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    console.error('Error JSON:', errorData);
                    errorMessage = errorData.message || JSON.stringify(errorData);
                    
                    // Si hay errores de validación
                    if (errorData.errors) {
                        errorMessage = Object.values(errorData.errors).flat().join('\n');
                    }
                } else {
                    const errorText = await response.text();
                    console.error('Error Text:', errorText);
                    errorMessage = errorText;
                }
                
                alert('Error al generar las constancias:\n' + errorMessage);
            }
        } catch (error) {
            console.error('Error catch:', error);
            alert('Error de conexión: ' + error.message);
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
                                Generar Constancias de Docentes
                            </h1>
                            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold">
                                ID: {capacitacion.id}
                            </span>
                        </div>
                        <p className="text-gray-600">
                            Se generarán constancias para <strong>{docentes?.length || 0} docente(s)</strong> en un archivo ZIP
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

                    {/* Lista de Docentes */}
                    {docentes && docentes.length > 0 && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                            <h3 className="font-semibold text-green-900 mb-3">
                                👥 Docentes que recibirán constancia
                            </h3>
                            <div className="max-h-48 overflow-y-auto">
                                <ul className="space-y-2 text-sm">
                                    {docentes.map((docente, index) => (
                                        <li key={docente.id || index} className="flex items-center text-gray-700">
                                            <span className="inline-block w-6 h-6 rounded-full bg-green-200 text-green-800 text-xs flex items-center justify-center mr-2">
                                                {index + 1}
                                            </span>
                                            <span>
                                                {docente.nombres} {docente.apellido_paterno} {docente.apellido_materno}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {docentes && docentes.length === 0 && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        No hay docentes registrados
                                    </h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Debe registrar al menos un docente para generar constancias.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                disabled={loading || (docentes && docentes.length === 0)}
                                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generando ZIP...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Generar Constancias ({docentes?.length || 0})
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