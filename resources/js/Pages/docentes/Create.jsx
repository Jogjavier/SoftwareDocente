import { useState } from "react";
import { router } from "@inertiajs/react";

export default function Create({ carreras}) {
  // Docente data
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
  const [anio_ingreso, setAnioIngreso] = useState("");
  const [carrera_id, setCarreraId] = useState("");

  // Niveles data
  const [niveles, setNiveles] = useState([]);

  const addNivel = (tipo) => {
    setNiveles([
      ...niveles,
      {
        id: Math.random(),
        nivel: tipo,
        siglas: "",
        nombre: "",
        escuela: "",
        cedula: "",
        titulo_path: null,
        cedula_path: null,
      },
    ]);
  };

  const removeNivel = (id) => {
    setNiveles(niveles.filter((n) => n.id !== id));
  };

  const updateNivel = (id, field, value) => {
    setNiveles(
      niveles.map((n) => (n.id === id ? { ...n, [field]: value } : n))
    );
  };

  const updateNivelFile = (id, field, file) => {
    setNiveles(
      niveles.map((n) => (n.id === id ? { ...n, [field]: file } : n))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Add docente data
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
    formData.append("anio_ingreso", anio_ingreso);
    formData.append("carrera_id", carrera_id);

    // Add niveles data
    niveles.forEach((nivel, index) => {
      formData.append(`niveles[${index}][nivel]`, nivel.nivel);
      formData.append(`niveles[${index}][siglas]`, nivel.siglas);
      formData.append(`niveles[${index}][nombre]`, nivel.nombre);
      formData.append(`niveles[${index}][escuela_procedencia]`, nivel.escuela);
      formData.append(`niveles[${index}][cedula]`, nivel.cedula);

      if (nivel.titulo_path) {
        formData.append(`niveles[${index}][titulo_path]`, nivel.titulo_path);
      }
      if (nivel.cedula_path) {
        formData.append(`niveles[${index}][cedula_path]`, nivel.cedula_path);
      }
    });

    Inertia.post("/docentes", formData, {
      forceFormData: true,
    });
  };

  const goToExperiencia = () => {
    window.location.href = route('docentes.experiencias.create', docente.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-red-800 rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold text-white">Dar de alta un docente</h1>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div onSubmit={handleSubmit} className="space-y-8">
          
          {/* Información Personal */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-gray-700 font-medium">Nombre(s):</label>
                <input
                  type="text"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-medium">Apellido Paterno:</label>
                <input
                  type="text"
                  value={apellido_paterno}
                  onChange={(e) => setApellidoPaterno(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-medium">Apellido Materno:</label>
                <input
                  type="text"
                  value={apellido_materno}
                  onChange={(e) => setApellidoMaterno(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-medium">Fecha de Nacimiento:</label>
                <input
                  type="date"
                  value={fecha_nacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-medium">Sexo:</label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-medium">RFC:</label>
                <input
                  type="text"
                  value={rfc}
                  onChange={(e) => setRfc(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  maxLength={13}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-medium">CURP:</label>
                <input
                  type="text"
                  value={curp}
                  onChange={(e) => setCurp(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  maxLength={18}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-medium">Correo Electrónico:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-medium">Teléfono:</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-medium">Nivel de Inglés:</label>
                <select
                  value={nivel_ingles}
                  onChange={(e) => setNivelIngles(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Bajo">Bajo</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Alto">Alto</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Año de ingreso:
                </label>
                <input
                  type="number"
                  value={anio_ingreso}
                  onChange={(e) => setAnioIngreso(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
                  placeholder="2024"
                  min="1900"
                  max="2100"
                  required
                />
              </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Departamento al que pertenece:
              </label>
              <select
                value={carrera_id}
                onChange={(e) => setCarreraId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Seleccione una carrera</option>
                {carreras.map((carrera) => (
                  <option key={carrera.id} value={carrera.id}>
                    {carrera.nombre}
                  </option>
                ))}
              </select>
            </div>
            </div>
          </div>

          {/* Niveles Académicos */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Niveles Académicos</h2>
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); addNivel("Licenciatura"); }}
                className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Agregar Licenciatura
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); addNivel("Maestría"); }}
                className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Agregar Maestría
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); addNivel("Doctorado"); }}
                className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Agregar Doctorado
              </button>
            </div>

            {niveles.length === 0 ? (
              <p className="text-gray-500 italic">No hay niveles agregados</p>
            ) : (
              <div className="space-y-4">
                {niveles.map((nivel) => (
                  <div key={nivel.id} className="border border-gray-300 rounded-lg p-5 bg-gray-50 relative">
                    <button
                      type="button"
                      onClick={() => removeNivel(nivel.id)}
                      className="absolute top-3 right-3 text-red-600 hover:text-red-800 text-2xl font-bold"
                    >
                      ✕
                    </button>

                    <h3 className="font-semibold text-lg mb-4 text-gray-800">{nivel.nivel}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-gray-700 font-medium">Siglas:</label>
                        <input
                          type="text"
                          value={nivel.siglas}
                          onChange={(e) => updateNivel(nivel.id, "siglas", e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="ej. UABC"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-gray-700 font-medium">
                          {`Nombre de la ${nivel.nivel}:`}
                        </label>

                        <input
                          type="text"
                          value={nivel.nombre}
                          onChange={(e) => updateNivel(nivel.id, "nombre", e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder={`Nombre de la ${nivel.nivel}`}
                        />
                      </div>


                      <div>
                        <label className="block mb-2 text-gray-700 font-medium">Escuela de procedencia:</label>
                        <input
                          type="text"
                          value={nivel.escuela}
                          onChange={(e) => updateNivel(nivel.id, "escuela", e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Nombre de la escuela/facultad"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-gray-700 font-medium">Número de Cédula:</label>
                        <input
                          type="text"
                          value={nivel.cedula}
                          onChange={(e) => updateNivel(nivel.id, "cedula", e.target.value)}
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Número de cédula profesional"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-gray-700 font-medium">Título (PDF/Imagen):</label>
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={(e) =>
                            updateNivelFile(nivel.id, "titulo_path", e.target.files[0])
                          }
                          className="w-full border border-gray-300 p-3 rounded-lg"
                        />
                        {nivel.titulo_path && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ {nivel.titulo_path.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-2 text-gray-700 font-medium">Cédula (PDF/Imagen):</label>
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={(e) =>
                            updateNivelFile(nivel.id, "cedula_path", e.target.files[0])
                          }
                          className="w-full border border-gray-300 p-3 rounded-lg"
                        />
                        {nivel.cedula_path && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ {nivel.cedula_path.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón Guardar */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-red-800 text-white hover:bg-red-700 hover:text-yellow-300 px-6 py-3 rounded-lg font-semibold transition"
            >
              Guardar Docente
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-300 text-gray-800 hover:bg-gray-400 px-6 py-3 rounded-lg font-semibold transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}