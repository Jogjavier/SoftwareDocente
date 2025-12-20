import React, { useState } from "react";
import {
  FaBook,
  FaUserTie,
  FaClipboardCheck,
  FaChalkboardTeacher,
} from "react-icons/fa";
// import { Inertia } from "@inertiajs/inertia";

const modules = [
  {
    name: "Catálogo",
    icon: <FaBook size={40} className="text-red-800" />,
    submenus: [
      { name: "Dar de alta", route: "/catalogo/carreras/create" },
      { name: "Ver Carreras", route: "/catalogo/carreras/index" },
    ],
  },
  {
    name: "Docente",
    icon: <FaUserTie size={40} className="text-red-800" />,
    submenus: [
      { name: "Registrar", route: "/docentes/create" },
      { name: "Ver docentes", route: "/docentes/index" },
      { name: "Activar Docente", route: "/docentes/activardocente/index" },
    ],
  },
  {
    name: "Evaluaciones",
    icon: <FaClipboardCheck size={40} className="text-red-800" />,
    submenus: [
      {
        name: "Evaluación docente",
        route: "/evaluaciones/evaluaciondocente",
      },
      {
        name: "Registrar evaluación docente",
        route: "/evaluaciones/evaluaciondocente/create",
      },
      {
        name: "Evaluación departamental",
        route: "/evaluaciones/departamental",
      },
    ],
  },
  {
    name: "Capacitaciones",
    icon: <FaChalkboardTeacher size={40} className="text-red-800" />,
    submenus: [
      { name: "Registrar Curso", route: "/capacitaciones/create" },
      {
        name: "Ver Capacitaciones y Constancias",
        route: "/capacitaciones/constancia/index",
      },
      {
        name: "Generar Constancia",
        route: "/capacitaciones/constancia/create",
      },
    ],
  },
];

export default function Dashboard() {
  const [openModule, setOpenModule] = useState(null);

  const toggleModule = (moduleName) => {
    setOpenModule(openModule === moduleName ? null : moduleName);
  };

  const handleNavigate = (route) => {
    console.log("Navegando a:", route);

    // 👉 Para Inertia (Laravel)
    // Inertia.visit(route);

    // 👉 Temporal (prueba)
    window.location.href = route;
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Encabezado */}
      <div className="bg-red-800 rounded-3xl p-8 mb-10 shadow-lg">
        <h1 className="text-4xl font-bold text-white text-center">
          Sistema de Profesionalización Docente
        </h1>
      </div>

      {/* Módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {modules.map((mod) => (
          <div key={mod.name} className="relative">
            {/* Card */}
            <button
              type="button"
              onClick={() => toggleModule(mod.name)}
              className="w-full bg-white rounded-2xl shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{mod.icon}</div>
                <h2 className="text-xl font-bold text-red-800">
                  {mod.name}
                </h2>
              </div>
            </button>

            {/* Submenú */}
            {openModule === mod.name && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-red-800 rounded-xl shadow-xl z-20">
                <div className="p-2">
                  {mod.submenus.map((sub) => (
                    <button
                      key={sub.name}
                      type="button"
                      onClick={() => handleNavigate(sub.route)}
                      className="w-full text-left py-2 px-4 rounded-lg text-white text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Logo */}
      <div className="mt-14 flex justify-center">
        <img
          src="/storage/ITSZO.webp"
          alt="Logo ITSZO"
          className="h-72 opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
  );
}
