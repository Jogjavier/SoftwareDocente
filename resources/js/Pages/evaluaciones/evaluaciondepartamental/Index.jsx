import { Link } from "@inertiajs/react";
import { BarChart3, Users, Building2, TrendingUp, ClipboardCheck } from "lucide-react";
import { router } from '@inertiajs/react';

export default function Index({ evaluaciones }) {
    const cards = [
        {
            title: "Evaluación por Docente",
            description: "Analiza el desempeño departamental individual de cada docente",
            icon: Users,
            color: "from-indigo-500 to-indigo-600",
            hoverColor: "hover:from-indigo-600 hover:to-indigo-700",
            route: "/evaluaciones/evaluaciondepartamental/por-docente",
            stats: "Docencia, Tutoría, Vinculación y Gestión"
        },
        {
            title: "Evaluación por Carrera",
            description: "Compara el desempeño departamental dentro de cada carrera",
            icon: Building2,
            color: "from-teal-500 to-teal-600",
            hoverColor: "hover:from-teal-600 hover:to-teal-700",
            route: "/evaluaciones/evaluaciondepartamental/por-carrera",
            stats: "Análisis comparativo por programa"
        },
        {
            title: "Evaluación General",
            description: "Vista panorámica del desempeño departamental institucional",
            icon: TrendingUp,
            color: "from-emerald-500 to-emerald-600",
            hoverColor: "hover:from-emerald-600 hover:to-emerald-700",
            route: "/evaluaciones/evaluaciondepartamental/general",
            stats: "Resultados globales institucionales"
        }
    ];

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta evaluación departamental?')) {
            router.delete(`/evaluaciones/evaluaciondepartamental/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    alert('Evaluación departamental eliminada exitosamente');
                },
                onError: (errors) => {
                    console.error('Error:', errors);
                    alert('Hubo un error al eliminar la evaluación');
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-8">
            {/* Encabezado Principal */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="text-center mb-8 relative">
                    {/* Logo izquierdo */}
                    <img 
                        src="/storage/logo.webp" 
                        alt="Logo Izquierdo" 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-40 w-40 object-contain"
                    />
                    
                    {/* Contenido central */}
                    <div className="px-44">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <ClipboardCheck className="w-12 h-12 text-indigo-600" />
                            <h1 className="text-5xl font-bold text-gray-800">
                                Evaluación Departamental
                            </h1>
                        </div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Sistema integral de evaluación de actividades departamentales: Docencia, Tutoría, Vinculación y Gestión
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
                <div className="flex items-center justify-center mb-8">
                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-indigo-600 to-transparent"></div>
                </div>

                {/* Botón de Nueva Evaluación */}
                <div className="flex justify-center gap-6 mb-12">
                    <Link
                        href="/evaluaciones/evaluaciondepartamental/create"
                        className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                    >
                        <ClipboardCheck className="w-5 h-5" />
                        Nueva Evaluación Departamental
                    </Link>
                </div>
            </div>

            {/* Grid de Tarjetas */}
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Reportes y Análisis Departamental
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
                                            <span className="text-2xl text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300">
                                                →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* LISTA DE EVALUACIONES DEPARTAMENTALES */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Evaluaciones Departamentales Registradas
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow">
                            <ClipboardCheck className="w-4 h-4" />
                            <span>Total: {evaluaciones.length}</span>
                        </div>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                                    <tr>
                                        <th className="p-4 font-semibold">Docente</th>
                                        <th className="p-4 font-semibold">Carrera</th>
                                        <th className="p-4 font-semibold">Periodo</th>
                                        <th className="p-4 font-semibold">Año</th>
                                        <th className="p-4 font-semibold text-center">Resultado Global</th>
                                        <th className="p-4 font-semibold text-center">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {evaluaciones.length > 0 ? (
                                        evaluaciones.map((evaluacion, index) => (
                                            <tr 
                                                key={evaluacion.id} 
                                                className={`border-b hover:bg-indigo-50 transition-colors ${
                                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                }`}
                                            >
                                                <td className="p-4 font-medium text-gray-800">
                                                    {evaluacion.docente && 
                                                        `${evaluacion.docente.nombres} ${evaluacion.docente.apellido_paterno} ${evaluacion.docente.apellido_materno}`
                                                    }
                                                </td>
                                                <td className="p-4 text-gray-700">
                                                    {evaluacion.carrera?.nombre || '—'}
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        {evaluacion.periodo}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-semibold text-gray-700">
                                                    {evaluacion.anio}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full font-bold">
                                                        {parseFloat(evaluacion.resultado_global).toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-center gap-2">
                                                        {/* EDITAR */}
                                                        <Link
                                                            href={`/evaluaciones/evaluaciondepartamental/${evaluacion.id}/edit`}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                                                        >
                                                            Editar
                                                        </Link>

                                                        {/* ELIMINAR */}
                                                        <button
                                                            onClick={() => handleDelete(evaluacion.id)}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-gray-500">
                                                <ClipboardCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p className="text-lg font-medium">No hay evaluaciones departamentales registradas</p>
                                                <p className="text-sm mt-1">Comienza creando una nueva evaluación</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer informativo */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-sm">
                            Las evaluaciones departamentales incluyen: Docencia, Tutoría, Vinculación y Gestión
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}