import { useState } from 'react';

const AgregarJugadorIndividual = () => {
  const opcionesPosicion = ['Arquero', 'Defensor', 'Mediocampista', 'Delantero'];

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    posicion_inicial: '',
    posicion_secundaria: '',
    numero: '',
    foto_url: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = true;
    if (!form.apellido.trim()) nuevosErrores.apellido = true;
    if (!form.fecha_nacimiento.trim()) nuevosErrores.fecha_nacimiento = true;
    if (!form.posicion_inicial) nuevosErrores.posicion_inicial = true;
    if (!form.posicion_secundaria) nuevosErrores.posicion_secundaria = true;
    if (!form.numero || isNaN(form.numero)) nuevosErrores.numero = true;
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     if (!validar()) {
      setMensaje('❌ Completá todos los campos requeridos.');
      return;
    }

    try {
      const res = await fetch('/api/jugador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setMensaje('✅ Jugador creado correctamente');
        setForm({
          nombre: '',
          apellido: '',
          fecha_nacimiento: '',
          posicion_inicial: '',
          posicion_secundaria: '',
          numero: '',
          foto_url: ''
        });
        setErrores({});
      } else {
        setMensaje('❌ Error al crear jugador');
      }
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al conectar con el servidor');
    }
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('foto', file);
  
    const res = await fetch('/api/upload/foto', {
      method: 'POST',
      body: formData
    });
  
    const data = await res.json();
    setForm((prev) => ({ ...prev, foto_url: data.url }));
  };
  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-3xl font-bold text-orange-700 mb-6 text-center">
        Agregar Jugador Individual
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white rounded-xl shadow p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Nombre *</label>
          <input
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errores.nombre ? 'border-red-500' : ''}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Apellido *</label>
          <input
            name="apellido"
            type="text"
            value={form.apellido}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errores.apellido ? 'border-red-500' : ''}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Fecha de nacimiento *</label>
          <input
            name="fecha_nacimiento"
            type="date"
            value={form.fecha_nacimiento}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errores.fecha_nacimiento ? 'border-red-500' : ''}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Posición inicial *</label>
          <select
            name="posicion_inicial"
            value={form.posicion_inicial}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errores.posicion_inicial ? 'border-red-500' : ''}`}
          >
            <option value="">Seleccionar</option>
            {opcionesPosicion.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Posición secundaria *</label>
          <select
            name="posicion_secundaria"
            value={form.posicion_secundaria}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errores.posicion_secundaria ? 'border-red-500' : ''}`}
          >
            <option value="">Seleccionar</option>
            {opcionesPosicion.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Número de camiseta *</label>
          <input
            name="numero"
            type="number"
            value={form.numero}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errores.numero ? 'border-red-500' : ''}`}
          />
        </div>

        <div>
        <label className="block text-sm font-medium text-orange-700 mb-1">Foto del jugador</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFotoChange}
          className="w-full border p-2 rounded"
        />
        {form.foto_url && (
          <img src={form.foto_url} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-full border" />
        )}
       </div>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 font-semibold"
        >
          Guardar jugador
        </button>

        {mensaje && <p className="text-sm text-center mt-2">{mensaje}</p>}
      </form>
    </div>
  );
};

export default AgregarJugadorIndividual;