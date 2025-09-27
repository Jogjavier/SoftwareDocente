import React, { useState } from "react";
import { FaBook, FaUserTie, FaClipboardCheck, FaChalkboardTeacher } from "react-icons/fa";
import { Inertia } from "@inertiajs/inertia";

const modules = [
  {
    name: "Catálogo",
    color: "burgundy",
    icon: <FaBook size={40} className="text-red-800" />,
    submenus: [
      { name: "Dar de alta", route: "/catalogo/carreras/create" },
      { name: "Ver Carreras", route: "/catalogo/carreras/index" },
    ],
  },
  {
    name: "Docente",
    color: "burgundy",
    icon: <FaUserTie size={40} className="text-red-800" />,
    submenus: [
      { name: "Registrar", route: "/docentes/create" },
      { name: "Ver docentes", route: "/docentes/index" },
    ],
  },
  {
    name: "Evaluaciones",
    color: "burgundy",
    icon: <FaClipboardCheck size={40} className="text-red-800" />,
    submenus: [
      { name: "Evaluación docente", route: "/evaluaciones/docente" },
      { name: "Evaluación departamental", route: "/evaluaciones/departamental" },
    ],
  },
  {
    name: "Capacitaciones",
    color: "burgundy",
    icon: <FaChalkboardTeacher size={40} className="text-red-800" />,
    submenus: [
      { name: "Dar de alta", route: "/capacitaciones/create" },
      { name: "Ver Capacitaciones", route: "/capacitaciones/index" },
    ],
  },
];

export default function Dashboard() {
  const [hoveredModule, setHoveredModule] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = (moduleName) => {
    // Limpiar cualquier timeout pendiente
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setHoveredModule(moduleName);
  };

  const handleMouseLeave = () => {
    // Establecer un delay de 0.1 segundos antes de ocultar el menú
    const id = setTimeout(() => {
      setHoveredModule(null);
    }, 100); // 0.1 segundo de delay
    setTimeoutId(id);
  };

  const handleSubmenuMouseEnter = () => {
    // Cancelar el timeout si el usuario vuelve a poner el mouse sobre el menú
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  const goTo = (route) => {
    // Con Inertia (descomenta si lo usas):
    Inertia.visit(route);
    console.log("Navegando a:", route);
  };

  const getCardStyle = (color) => {
    return "bg-white hover:shadow-lg";
  };

  const getTitleColor = (color) => {
    return "text-red-800";
  };

  const getSubmenuStyle = (color) => {
    return "bg-red-800 border-red-700";
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="bg-red-800 rounded-3xl p-8 mb-8">
        <h1 className="text-4xl font-bold text-white text-center">
          Sistema de Profesionalización Docente
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {modules.map((mod) => (
          <div
            key={mod.name}
            className={`${getCardStyle(mod.color)} rounded-2xl shadow-md p-6 cursor-pointer transition-all duration-300 hover:scale-105 relative`}
            onMouseEnter={() => handleMouseEnter(mod.name)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Contenido principal de la carta */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                {mod.icon}
              </div>
              <h2 className={`text-xl font-bold ${getTitleColor(mod.color)}`}>
                {mod.name}
              </h2>
              <p className="text-gray-500 mt-2 text-sm">{mod.description}</p>
            </div>

            {/* Submenu que aparece al hacer hover */}
            {hoveredModule === mod.name && (
              <div 
                className={`absolute top-full left-0 right-0 ${getSubmenuStyle(mod.color)} rounded-lg shadow-lg border mt-2 z-10 animate-in fade-in duration-200`}
                onMouseEnter={handleSubmenuMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="p-2">
                  {mod.submenus.map((sub, index) => (
                    <div
                      key={sub.name}
                      className="py-2 px-3 rounded hover:bg-red-700 cursor-pointer text-yellow-500 transition-colors duration-150 text-sm font-medium hover:text-yellow-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        goTo(sub.route);
                      }}
                    >
                      {sub.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}