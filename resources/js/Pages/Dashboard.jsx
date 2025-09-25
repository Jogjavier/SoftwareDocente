import React, { useState } from "react";
import { FaBook, FaUserTie, FaClipboardCheck, FaChalkboardTeacher } from "react-icons/fa";

const modules = [
  {
    name: "Catálogo",
    color: "blue",
    icon: <FaBook size={40} className="text-blue-600" />,
    submenus: [
      { name: "Dar de alta", route: "/Catalogo/Carreras/create" },
      { name: "Ver Carreras", route: "/Catalogo/Carreras/index" },
      { name: "Editar", route: "/Catalogo/Carreras/edit" },
      { name: "Eliminar", route: "/Catalogo/Carreras/delete" },
    ],
  },
  {
    name: "Docente",
    color: "green",
    icon: <FaUserTie size={40} className="text-green-600" />,
    submenus: [
      { name: "Registrar", route: "/docentes/registrar" },
      { name: "Ver docentes", route: "/docentes/ver" },
      { name: "Editar", route: "/docentes/editar" },
      { name: "Eliminar", route: "/docentes/eliminar" },
    ],
  },
  {
    name: "Evaluaciones",
    color: "yellow",
    icon: <FaClipboardCheck size={40} className="text-yellow-600" />,
    submenus: [
      { name: "Evaluación docente", route: "/evaluaciones/docente" },
      { name: "Evaluación departamental", route: "/evaluaciones/departamental" },
    ],
  },
  {
    name: "Capacitaciones",
    color: "purple",
    icon: <FaChalkboardTeacher size={40} className="text-purple-600" />,
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
    // Establecer un delay de 1.5 segundos antes de ocultar el menú
    const id = setTimeout(() => {
      setHoveredModule(null);
    }, 100); // 1 segundo de delay
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
    // Inertia.visit(route);

    // Sin Inertia:
    console.log("Navegando a:", route);
    // window.location.href = route;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Sistema de Profesionalización Docente</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((mod) => (
          <div
            key={mod.name}
            className="bg-white rounded-2xl shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 relative"
            onMouseEnter={() => handleMouseEnter(mod.name)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Contenido principal de la carta */}
            <div className="flex flex-col items-center">
              <div className="mb-4">{mod.icon}</div>
              <h2 className={`text-xl font-semibold text-${mod.color}-600`}>{mod.name}</h2>
              <p className="text-gray-500 mt-2 text-sm">{mod.description}</p>
            </div>

            {/* Submenu que aparece al hacer hover */}
            {hoveredModule === mod.name && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg border mt-2 z-10 animate-in fade-in duration-200">
                <div className="p-2">
                  {mod.submenus.map((sub, index) => (
                    <div
                      key={sub.name}
                      className="py-2 px-3 rounded hover:bg-gray-100 cursor-pointer text-gray-700 transition-colors duration-150 text-sm"
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