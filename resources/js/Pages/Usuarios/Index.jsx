import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import { 
  FaUserPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaUserShield, 
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaEye
} from 'react-icons/fa';

export default function Index({ users, flash }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (user) => {
    if (confirm(`¿Estás seguro de eliminar al usuario "${user.name}"?`)) {
      router.delete(route('usuarios.destroy', user.id));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800">
            Gestión de Usuarios
          </h2>
          <Link
            href={route('dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FaArrowLeft /> Volver
          </Link>
        </div>
      }
    >
      <Head title="Usuarios" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Mensajes de éxito/error */}
          {flash?.success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-3">
              <FaCheckCircle className="text-green-600" size={20} />
              <span>{flash.success}</span>
            </div>
          )}

          {flash?.error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3">
              <FaTimesCircle className="text-red-600" size={20} />
              <span>{flash.error}</span>
            </div>
          )}

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            {/* Encabezado y buscador */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Lista de Usuarios
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Total: {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Buscador */}
                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full rounded-lg border border-gray-300 focus:border-red-800 focus:ring focus:ring-red-200 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Registro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <FaUser className="text-gray-300" size={48} />
                          <p className="text-gray-500">
                            {searchTerm 
                              ? 'No se encontraron usuarios con ese criterio de búsqueda'
                              : 'No hay usuarios registrados'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-800 font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <FaUserShield />
                              Administrador
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <FaUser />
                              Usuario
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={route('usuarios.show', user.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              <FaEye /> Ver
                            </Link>
                            <Link
                              href={route('usuarios.edit', user.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <FaEdit /> Editar
                            </Link>
                            <button
                              onClick={() => handleDelete(user)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <FaTrash /> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer con estadísticas */}
            {filteredUsers.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">
                        Administradores: {filteredUsers.filter(u => u.role === 'admin').length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">
                        Usuarios: {filteredUsers.filter(u => u.role === 'usuario').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}