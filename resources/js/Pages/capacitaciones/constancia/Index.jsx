import React, { useState } from "react";
import { Link } from "@inertiajs/react";

export default function Index({ constancias }) {
    const handleDelete = (id) => {
        if (confirm("¿Seguro que deseas eliminar este docente?")) {
          Inertia.delete(`/docentes/${id}`);
        }
      };
    
      const handleSearch = (e) => {
        e.preventDefault();
        Inertia.get("/capacitaciones/constancia/index", { search });
      };

      const getTipo = (constancia) => {
            if (constancia.curso_interno) {
                return "Curso Interno";
            } else if (constancia.curso_externo) {
                return "Curso Externo";
            } else {
                return "Constancia";
            }
        };

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="bg-red-800 rounded-xl p-6 mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Constancias Registradas</h1>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
                <table className="w-full border">
                    <thead>
                        <tr className="bg-red-800 text-white">
                            <th className="p-3 border-r border-red-700 text-left">Nombre del Curso</th>
                            <th className="p-3 border-r border-red-700 text-left">Tipo</th>
                            <th className="p-3 border-r border-red-700 text-center">PDF</th>
                            <th className="p-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {constancias.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">
                                    No hay constancias registradas
                                </td>
                            </tr>
                        ) : (
                            constancias.map((c) => (
                                <tr key={c.id} className="border hover:bg-gray-50">
                                    <td className="p-3">{c.nombre_curso}</td>

                                    <td className="p-3">
                                        {c.curso_interno ? (
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
                                                Curso Interno
                                            </span>
                                        ) : c.curso_externo ? (
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                                                Curso Externo
                                            </span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-semibold">
                                                Constancia
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-3 text-center">
                                        {c.pdf_path ? (
                                            <a
                                                href={`/storage/${c.pdf_path}`}
                                                className="text-blue-600 hover:text-blue-800 underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Ver PDF
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">No disponible</span>
                                        )}
                                    </td>

                                    <td className="p-3">
                                        <div className="flex gap-2 justify-center">
                                            <Link
                                                href={route('capacitaciones.constancia.edit', c.id)}
                                                className="px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-400 rounded"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-500 rounded"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
}
