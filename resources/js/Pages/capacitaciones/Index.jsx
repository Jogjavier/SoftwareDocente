import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function Index({ constancias = [], filters }) {
    const [search, setSearch] = useState(filters?.search || "");

    const handleDelete = (id) => {
        if (confirm("¿Seguro que deseas eliminar esta constancia?")) {
            router.delete(`/capacitaciones/${id}`);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/capacitaciones/index", { search }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleView = (id) => {
        router.visit(`/capacitaciones/${id}`);
    };

    const handleEdit = (id) => {
        router.visit(`/capacitaciones/${id}/edit`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="bg-red-800 rounded-xl p-6 mb-8 shadow-lg">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img src="/storage/logo.webp" alt="Logo" className="h-20 rounded" />
                        <img src="/storage/ITSZO.webp" alt="ITSZO" className="h-20 rounded" />
                    </div>
                    <h1 className="text-3xl font-bold text-white text-center flex-1">
                        Listado de Cursos y Constancias
                    </h1>
                    <button
                        onClick={() => router.visit("/")}
                        className="bg-yellow-400 text-red-800 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition shadow-md"
                    >
                        Inicio
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Barra de acciones */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar por nombre del curso..."
                                    className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="bg-red-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition shadow-md"
                                >
                                    Buscar
                                </button>
                                {search && (
                                    <button
                                        onClick={() => {
                                            setSearch("");
                                            router.get("/capacitaciones/index");
                                        }}
                                        className="bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => router.visit("/capacitaciones/create")}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md whitespace-nowrap"
                        >
                            + Nueva Capacitación
                        </button>
                    </div>
                </div>

                {/* Tabla de constancias */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {constancias.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-red-800 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold">Nombre del Curso</th>
                                        <th className="px-6 py-4 text-left font-semibold">Tipo de Curso</th>
                                        <th className="px-6 py-4 text-left font-semibold">Modalidad</th>
                                        <th className="px-6 py-4 text-center font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {constancias.map((c) => (
                                        <tr key={c.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{c.nombre}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                                    c.tipo_curso === 'interno' 
                                                        ? 'bg-blue-100 text-blue-800' 
                                                        : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {c.tipo_curso?.charAt(0).toUpperCase() + c.tipo_curso?.slice(1) || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                                    c.modalidad === 'presencial' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : c.modalidad === 'virtual'
                                                        ? 'bg-orange-100 text-orange-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {c.modalidad?.charAt(0).toUpperCase() + c.modalidad?.slice(1) || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleView(c.id)}
                                                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                                        title="Ver detalles"
                                                    >
                                                        Ver
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(c.id)}
                                                        className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-yellow-600 transition"
                                                        title="Editar"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(c.id)}
                                                        className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                                                        title="Eliminar"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-xl text-gray-500 font-medium mb-2">
                                No se encontraron capacitaciones
                            </p>
                            <p className="text-gray-400 mb-6">
                                {search ? 'Intenta con otro término de búsqueda' : 'Comienza registrando una nueva capacitación'}
                            </p>
                            {!search && (
                                <button
                                    onClick={() => router.visit("/capacitaciones/create")}
                                    className="bg-red-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition shadow-md"
                                >
                                    + Registrar Primera Capacitación
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Información adicional */}
                {constancias.length > 0 && (
                    <div className="mt-6 text-center text-gray-600">
                        <p className="text-sm">
                            Mostrando <span className="font-semibold text-red-800">{constancias.length}</span> capacitación{constancias.length !== 1 ? 'es' : ''}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}