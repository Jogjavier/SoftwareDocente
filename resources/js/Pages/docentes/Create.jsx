import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function Create() {
  // --- Datos del docente ---
  const [nombres, setNombres] = useState("");
  const [apellido_paterno, setApellidoPaterno] = useState("");
  const [apellido_materno, setApellidoMaterno] = useState("");
  const [fecha_nacimiento, setFechaNacimiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [rfc, setRfc] = useState("");
  const [curp, setCurp] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nivel_ingles, setNivelIngles] = useState("");

  // --- Niveles ---
  const [niveles, setNiveles] = useState([]);

  const addNivel = (tipo) => {
    setNiveles([
      ...niveles,
      { tipo, siglas: "", nombre: "", escuela: "", titulo: null, cedula: null },
    ]);
  };

  const handleNivelChange = (index, field, value) => {
    const nuevos = [...niveles];
    nuevos[index][field] = value;
    setNiveles(nuevos);
  };

  const handleFileChange = (index, field, file) => {
    const nuevos = [...niveles];
    nuevos[index][field] = file;
    setNiveles(nuevos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Datos del docente
    formData.append("nombres", nombres);
    formData.append("apellido_paterno", apellido_paterno);
    formData.append("apellido_materno", apellido_materno);
    formData.append("fecha_nacimiento", fecha_nacimiento);
    formData.append("sexo", sexo);
    formData.append("rfc", rfc);
    formData.append("curp", curp);
    formData.append("email", email);
    formData.append("telefono", telefono);
    formData.append("nivel_ingles", nivel_ingles);

    // Datos de niveles - CORREGIDOS los nombres de archivos
    niveles.forEach((nivel, index) => {
      formData.append(`niveles[${index}][nivel]`, nivel.tipo);
      formData.append(`niveles[${index}][siglas]`, nivel.siglas);
      formData.append(`niveles[${index}][nombre]`, nivel.nombre);
      formData.append(`niveles[${index}][escuela_procedencia]`, nivel.escuela);

      // ✅ CORREGIDO: Usar titulo_path y cedula_path en lugar de titulo y cedula
      if (nivel.titulo) {
        formData.append(`niveles[${index}][titulo_path]`, nivel.titulo);
      }
      if (nivel.cedula) {
        formData.append(`niveles[${index}][cedula_path]`, nivel.cedula);
      }
    });

    Inertia.post("/docentes", formData, {
      forceFormData: true, 
    });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="bg-red-800 rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold text-white">Dar de alta un docente</h1>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre(s) */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Nombre(s):</label>
            <input
              type="text"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              required
            />
          </div>

          {/* Apellido Paterno */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Apellido Paterno:</label>
            <input
              type="text"
              value={apellido_paterno}
              onChange={(e) => setApellidoPaterno(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              required
            />
          </div>

          {/* Apellido Materno */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Apellido Materno:</label>
            <input
              type="text"
              value={apellido_materno}
              onChange={(e) => setApellidoMaterno(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
            />
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Fecha de Nacimiento:</label>
            <input
              type="date"
              value={fecha_nacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              required
            />
          </div>

          {/* Sexo */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Sexo:</label>
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              required
            >
              <option value="">Seleccionar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          {/* RFC */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">RFC:</label>
            <input
              type="text"
              value={rfc}
              onChange={(e) => setRfc(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              maxLength={13}
              required
            />
          </div>

          {/* CURP */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">CURP:</label>
            <input
              type="text"
              value={curp}
              onChange={(e) => setCurp(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              maxLength={18}
              required
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Correo Electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              required
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Teléfono:</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
            />
          </div>

          {/* Nivel de inglés */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Nivel de Inglés:</label>
            <select
              value={nivel_ingles}
              onChange={(e) => setNivelIngles(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              required
            >
              <option value="">Seleccionar</option>
              <option value="Bajo">Bajo</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Alto">Alto</option>
            </select>
          </div>

          {/* Botones para añadir niveles */}
          <div className="flex gap-2">
            <button type="button" onClick={() => addNivel("Licenciatura")} className="bg-red-800 text-white px-3 py-1 rounded">
              Añadir Licenciatura
            </button>
            <button type="button" onClick={() => addNivel("Maestría")} className="bg-red-800 text-white px-3 py-1 rounded">
              Añadir Maestría
            </button>
            <button type="button" onClick={() => addNivel("Doctorado")} className="bg-red-800 text-white px-3 py-1 rounded">
              Añadir Doctorado
            </button>
          </div>

          {/* Lista de niveles añadidos */}
          {niveles.map((nivel, index) => (
            <div key={index} className="border rounded p-3 bg-gray-50 mt-4">
              <h2 className="font-semibold">{nivel.tipo}</h2>
              <input
                type="text"
                placeholder="Siglas"
                value={nivel.siglas}
                onChange={(e) => handleNivelChange(index, "siglas", e.target.value)}
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                placeholder={`Nombre de la ${nivel.tipo}`}
                value={nivel.nombre}
                onChange={(e) => handleNivelChange(index, "nombre", e.target.value)}
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                placeholder="Escuela de procedencia"
                value={nivel.escuela}
                onChange={(e) => handleNivelChange(index, "escuela", e.target.value)}
                className="border p-2 w-full mb-2"
              />

              {/* Archivos */}
              <div className="mb-2">
                <label className="block text-gray-700">Título:</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => handleFileChange(index, "titulo", e.target.files[0])}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Cédula:</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => handleFileChange(index, "cedula", e.target.files[0])}
                  className="w-full"
                />
              </div>
            </div>
          ))}

          {/* Botón Guardar */}
          <div>
            <button
              type="submit"
              className="w-full bg-red-800 text-yellow-400 hover:bg-red-700 hover:text-yellow-300 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}