import { Link } from "@inertiajs/react";
import { BarChart3, Users, Building2, TrendingUp } from "lucide-react";
import { router } from '@inertiajs/react';

export default function Index( {evaluaciones}) {
    const cards = [
        {
            title: "Evaluación por Docente",
            description: "Visualiza el desempeño individual de cada docente a través del tiempo",
            icon: Users,
            color: "from-blue-500 to-blue-600",
            hoverColor: "hover:from-blue-600 hover:to-blue-700",
            route: "/evaluaciones/evaluaciondocente/por-docente",
            stats: "Análisis individual detallado"
        },
        {
            title: "Evaluación por Carrera",
            description: "Compara el rendimiento de docentes dentro de cada carrera",
            icon: Building2,
            color: "from-purple-500 to-purple-600",
            hoverColor: "hover:from-purple-600 hover:to-purple-700",
            route: "/evaluaciones/evaluaciondocente/por-carrera",
            stats: "Comparativas por programa"
        },
        {
            title: "Evaluación General",
            description: "Obtén una vista panorámica del desempeño en todas las carreras",
            icon: TrendingUp,
            color: "from-green-500 to-green-600",
            hoverColor: "hover:from-green-600 hover:to-green-700",
            route: "/evaluaciones/evaluaciondocente/general",
            stats: "Vista institucional completa"
        }
    ];
    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta evaluación?')) {
            router.delete(`/evaluaciones/evaluaciondocente/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    alert('Evaluación eliminada exitosamente');
                },
                onError: (errors) => {
                    console.error('Error:', errors);
                    alert('Hubo un error al eliminar la evaluación');
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            {/* Encabezado Principal */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="text-center mb-8 relative">
                    {/* Logo izquierdo */}
                    <img 
                        src="/storage/ITSZO.webp" 
                        alt="Logo Izquierdo" 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-40 w-40 object-contain"
                    />
                    
                    {/* Contenido central */}
                    <div className="px-32">
                        <h1 className="text-5xl font-bold text-gray-800 mb-3">
                            Sistema de Evaluación Docente
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Analiza, compara y mejora el desempeño académico institucional
                        </p>
                    </div>

                    {/* Logo derecho */}
                    <img 
                        src="/storage/ITSZO.webp" 
                        alt="Logo Derecho" 
                        className="absolute right-0 top-1/2 -translate-y-1/2 h-40 w-40 object-contain"
                    />
                </div>

                {/* Línea decorativa */}
                <div className="flex items-center justify-center mb-12">
                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-red-800 to-transparent"></div>
                </div>

                {/* Contenedor de los botones */}
                <div className="flex justify-center gap-6 mb-12">
                    {/* Botón: Crear Evaluación */}
                    <Link
                        href="/evaluaciones/evaluaciondocente/create"
                        className="bg-red-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                        Nueva Evaluación
                    </Link>
                </div>
            </div>

            {/* Grid de Tarjetas */}
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Reportes y Análisis
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <Link
                                key={index}
                                href={card.route}
                                className="group"
                            >
                                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden h-full">
                                    {/* Header con gradiente */}
                                    <div className={`bg-gradient-to-r ${card.color} ${card.hoverColor} p-6 transition-all duration-300`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                                <span className="text-white text-sm font-medium">
                                                    Ver más →
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {card.title}
                                        </h3>
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-6">
                                        <p className="text-gray-600 mb-4 leading-relaxed">
                                            {card.description}
                                        </p>
                                        
                                        {/* Badge de estadística */}
                                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                                            <BarChart3 className="w-4 h-4" />
                                            <span>{card.stats}</span>
                                        </div>
                                    </div>

                                    {/* Footer con efecto hover */}
                                    <div className="px-6 pb-6">
                                        <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-sm">
                                            <span className="text-gray-500 font-medium">
                                                Acceder al reporte
                                            </span>
                                            <span className="text-2xl text-gray-300 group-hover:text-red-800 group-hover:translate-x-1 transition-all duration-300">
                                                →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                
                {/* Footer informativo */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Los reportes incluyen tablas detalladas y gráficas interactivas para un análisis profundo
                    </p>
                </div>
                {/* LISTA DE EVALUACIONES */}
                <div className="max-w-7xl mx-auto mt-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Evaluaciones Registradas
                    </h2>

                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 text-gray-600">
                                <tr>
                                    <th className="p-3">Docente</th>
                                    <th className="p-3">Carrera</th>
                                    <th className="p-3">Semestre</th>
                                    <th className="p-3">Año</th>
                                    <th className="p-3 text-center">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {evaluaciones.map((evaluacion) => (
                                    <tr key={evaluacion.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                        {evaluacion.docente && `${evaluacion.docente.nombres} ${evaluacion.docente.apellido_paterno} ${evaluacion.docente.apellido_materno}`}
                                        </td>
                                        <td className="p-3">{evaluacion.carrera?.nombre}</td>
                                        <td className="p-3">{evaluacion.periodo}</td>
                                        <td className="p-3">{evaluacion.anio}</td>

                                        <td className="p-3 flex justify-center gap-4">

                                            {/* EDITAR */}
                                            <Link
                                                href={`/evaluaciones/evaluaciondocente/${evaluacion.id}/edit`}
                                                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                                            >
                                                Editar
                                            </Link>

                                            {/* ELIMINAR */}
                                            <button
                                                onClick={() => handleDelete(evaluacion.id)}
                                                className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
                                            >
                                                Eliminar
                                            </button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}