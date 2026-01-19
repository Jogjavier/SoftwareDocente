import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
  FaUser, 
  FaEnvelope, 
  FaUserShield, 
  FaCalendarAlt, 
  FaEdit, 
  FaTrash, 
  FaArrowLeft,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';

export default function Show({ user, auth }) {
  // Validación de datos
  if (!user || !user.name) {
    return (
      <AuthenticatedLayout>
        <Head title="Error" />
        <div className="py-12">
          <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-lg shadow">
              <p className="text-red-600">Error: No se pudieron cargar los datos del usuario.</p>
              <Link href={route('usuarios.index')} className="text-blue-600 hover:underline mt-4 inline-block">
                Volver a la lista
              </Link>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de eliminar al usuario "${user.name}"?`)) {
      router.delete(route('usuarios.destroy', user.id));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isCurrentUser = auth?.user?.id === user.id;

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800">
            Detalles del Usuario
          </h2>
          <Link
            href={route('usuarios.index')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FaArrowLeft /> Volver
          </Link>
        </div>
      }
    >
      <Head title={`Usuario - ${user.name}`} />

      <div className="py-12">
        <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            {/* Header con Avatar */}
            <div className="bg-gradient-to-r from-red-800 to-red-600 p-8">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-red-800 font-bold text-4xl">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    {user.role === 'admin' ? (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500 text-white">
                        <FaUserShield />
                        Administrador
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500 text-white">
                        <FaUser />
                        Usuario
                      </span>
                    )}
                    {isCurrentUser && (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-green-500 text-white">
                        <FaCheckCircle />
                        Tú
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Información del usuario */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <FaEnvelope className="text-red-800" size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Correo Electrónico
                      </p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rol con descripción */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <FaUserShield className="text-purple-800" size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Rol del Sistema
                      </p>
                      <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
                        {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {user.role === 'admin' 
                      ? 'Acceso completo a todas las funcionalidades del sistema'
                      : 'Permisos de solo lectura en el sistema'}
                  </p>
                </div>

                {/* Fecha de creación */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FaCalendarAlt className="text-blue-800" size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Fecha de Registro
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Última actualización */}
                {user.updated_at && (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <FaClock className="text-green-800" size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Última Actualización
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {formatDate(user.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Permisos del rol */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Permisos y Accesos
                </h4>
                <div className="space-y-2">
                  {user.role === 'admin' ? (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <FaCheckCircle className="text-green-600" />
                        <span className="text-gray-700">Crear, editar y eliminar carreras</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaCheckCircle className="text-green-600" />
                        <span className="text-gray-700">Gestión completa de docentes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaCheckCircle className="text-green-600" />
                        <span className="text-gray-700">Registro y edición de evaluaciones</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaCheckCircle className="text-green-600" />
                        <span className="text-gray-700">Administración de capacitaciones</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaCheckCircle className="text-green-600" />
                        <span className="text-gray-700">Gestión de usuarios del sistema</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <FaCheckCircle className="text-blue-600" />
                        <span className="text-gray-700">Ver información de carreras</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaCheckCircle className="text-blue-600" />
                        <span className="text-gray-700">Consultar datos de docentes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaCheckCircle className="text-blue-600" />
                        <span className="text-gray-700">Ver evaluaciones y reportes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaCheckCircle className="text-blue-600" />
                        <span className="text-gray-700">Consultar capacitaciones</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Acciones
                  </h4>
                  <div className="flex gap-3">
                    <Link
                      href={route('usuarios.edit', user.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaEdit /> Editar
                    </Link>
                    {!isCurrentUser && (
                      <button
                        onClick={handleDelete}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <FaTrash /> Eliminar
                      </button>
                    )}
                  </div>
                </div>
                {isCurrentUser && (
                  <p className="mt-3 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <strong>Nota:</strong> No puedes eliminar tu propia cuenta por seguridad.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}