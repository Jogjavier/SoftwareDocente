import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FaUser, FaEnvelope, FaLock, FaUserShield, FaEye, FaEyeSlash, FaSave, FaArrowLeft } from 'react-icons/fa';

export default function Create() {
  const [showPassword, setShowPassword] = useState(false);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'usuario',
  });

  function submit(e) {
    e.preventDefault();
    post(route('usuarios.store'), {
      onSuccess: () => reset('password', 'password_confirmation'),
    });
  }

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800">
            Crear Nuevo Usuario
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
      <Head title="Crear Usuario" />

      <div className="py-12">
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-8">
              {/* Encabezado del formulario */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="bg-red-800 p-3 rounded-lg">
                    <FaUser className="text-white" size={24} />
                  </div>
                  Información del Usuario
                </h3>
                <p className="text-gray-600 mt-2">
                  Complete los siguientes campos para crear una nueva cuenta de usuario
                </p>
              </div>

              <form onSubmit={submit} className="space-y-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={e => setData('name', e.target.value)}
                      className={`pl-10 w-full rounded-lg border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:border-red-800 focus:ring focus:ring-red-200 transition-colors`}
                      placeholder="Ej: Juan Pérez García"
                      required
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={e => setData('email', e.target.value)}
                      className={`pl-10 w-full rounded-lg border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:border-red-800 focus:ring focus:ring-red-200 transition-colors`}
                      placeholder="ejemplo@correo.com"
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={e => setData('password', e.target.value)}
                      className={`pl-10 pr-10 w-full rounded-lg border ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      } focus:border-red-800 focus:ring focus:ring-red-200 transition-colors`}
                      placeholder="Mínimo 8 caracteres"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    La contraseña debe tener al menos 8 caracteres
                  </p>
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      id="password_confirmation"
                      type={showPassword ? 'text' : 'password'}
                      value={data.password_confirmation}
                      onChange={e => setData('password_confirmation', e.target.value)}
                      className={`pl-10 w-full rounded-lg border ${
                        errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                      } focus:border-red-800 focus:ring focus:ring-red-200 transition-colors`}
                      placeholder="Repita la contraseña"
                      required
                    />
                  </div>
                  {errors.password_confirmation && (
                    <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                  )}
                </div>

                {/* Rol */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Rol del Usuario <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserShield className="text-gray-400" />
                    </div>
                    <select
                      id="role"
                      value={data.role}
                      onChange={e => setData('role', e.target.value)}
                      className={`pl-10 w-full rounded-lg border ${
                        errors.role ? 'border-red-500' : 'border-gray-300'
                      } focus:border-red-800 focus:ring focus:ring-red-200 transition-colors`}
                      required
                    >
                      <option value="usuario">Usuario (Solo lectura)</option>
                      <option value="admin">Administrador (Todos los permisos)</option>
                    </select>
                  </div>
                  {errors.role && (
                    <p className="mt-2 text-sm text-red-600">{errors.role}</p>
                  )}
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800">
                      <strong>Usuario:</strong> Puede ver y consultar información, pero no crear, editar o eliminar.
                      <br />
                      <strong>Administrador:</strong> Tiene acceso completo a todas las funcionalidades del sistema.
                    </p>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                  <Link
                    href={route('usuarios.index')}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center gap-2 px-6 py-2.5 bg-red-800 text-white rounded-lg hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaSave />
                    {processing ? 'Guardando...' : 'Crear Usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}