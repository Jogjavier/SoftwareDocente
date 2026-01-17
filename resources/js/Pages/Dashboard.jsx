import React, { useState } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import {
  FaBook,
  FaUserTie,
  FaClipboardCheck,
  FaChalkboardTeacher,
  FaUserPlus,
} from "react-icons/fa";

export default function Dashboard() {
  const [openModule, setOpenModule] = useState(null);
  const { auth } = usePage().props;
  const isAdmin = auth.user.role === 'admin';

  // Configuración de módulos con permisos
  const modules = [
    {
      name: "Catálogo",
      icon: <FaBook size={40} className="text-red-800" />,
      submenus: [
        { name: "Dar de alta", route: "/catalogo/carreras/create", adminOnly: true },
        { name: "Ver Carreras", route: "/catalogo/carreras/index", adminOnly: false },
      ],
    },
    {
      name: "Docente",
      icon: <FaUserTie size={40} className="text-red-800" />,
      submenus: [
        { name: "Registrar Docente", route: "/docentes/create", adminOnly: true },
        { name: "Ver docentes", route: "/docentes/index", adminOnly: false },
        { name: "Activar Docente", route: "/docentes/activardocente/index", adminOnly: false },
      ],
    },
    {
      name: "Evaluaciones",
      icon: <FaClipboardCheck size={40} className="text-red-800" />,
      submenus: [
        {
          name: "Evaluación docente",
          route: "/evaluaciones/evaluaciondocente",
          adminOnly: false,
        },
        {
          name: "Registrar evaluación docente",
          route: "/evaluaciones/evaluaciondocente/create",
          adminOnly: true,
        },
        {
          name: "Evaluación departamental",
          route: "/evaluaciones/evaluaciondepartamental",
          adminOnly: false,
        },
        {
          name: "Registrar evaluación departamental",
          route: "/evaluaciones/evaluaciondepartamental/create",
          adminOnly: true,
        },
      ],
    },
    {
      name: "Capacitaciones",
      icon: <FaChalkboardTeacher size={40} className="text-red-800" />,
      submenus: [
        { name: "Registrar Curso", route: "/capacitaciones/create", adminOnly: true },
        {
          name: "Ver Capacitaciones y Constancias",
          route: "/capacitaciones/index",
          adminOnly: false,
        },
      ],
    },
    {
      name: "Usuarios",
      icon: <FaUserPlus size={40} className="text-red-800" />,
      submenus: [
        { name: "Crear Usuario", route: "/usuarios/create", adminOnly: true },
        { name: "Ver Usuarios", route: "/usuarios/index", adminOnly: true },
      ],
    },
  ];

  const toggleModule = (moduleName) => {
    setOpenModule(openModule === moduleName ? null : moduleName);
  };

  const handleNavigate = (route) => {
    router.visit(route);
  };

  // Filtrar submenús según el rol del usuario
  const getFilteredSubmenus = (submenus) => {
    if (isAdmin) {
      return submenus; // Admin ve todo
    }
    return submenus.filter(submenu => !submenu.adminOnly); // Usuario solo ve lo permitido
  };

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Encabezado del Dashboard */}
          <div className="bg-red-800 rounded-3xl p-8 mb-10 shadow-lg">
            <h1 className="text-4xl font-bold text-white text-center">
              Sistema de Profesionalización Docente
            </h1>
            <p className="text-white text-center mt-2 text-sm">
              Rol: <span className="font-semibold capitalize">{auth.user.role}</span>
            </p>
          </div>

          {/* Módulos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {modules.map((mod) => {
              const filteredSubmenus = getFilteredSubmenus(mod.submenus);
              
              // No mostrar módulo si no tiene submenús disponibles para el usuario
              if (filteredSubmenus.length === 0) return null;

              return (
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
                        {filteredSubmenus.map((sub) => (
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
              );
            })}
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
      </div>
    </AuthenticatedLayout>
  );
}