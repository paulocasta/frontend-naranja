import { useState, useEffect } from 'react';
import Torneo from '../components/TorneoDropdown';

const AdminRivales = () => {
  
  const [rivales, setRivales] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState('Seleccione un Torneo');
  const [torneosDisponibles, setTorneosDisponibles] = useState([]);
  const [form, setForm] = useState({
    nombre: ''
  });
  
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  
  useEffect(() => {
    fetchTorneos();  
  }, []);
  
  const buscarRivales = async (torneoId) => {
    if (isNaN(torneoId)) 
      return
    
    setTorneoSeleccionado(torneoId);

    try {
      fetchRivales(torneoId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    
  };

  const fetchTorneos = async () => {
      var resTorneos = await fetch(`/api/torneos`);
      var dataTorneos = await resTorneos.json();
      setTorneosDisponibles(dataTorneos);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const fetchRivales = async (torneoId) => {
    // fetch rivales
    const resRivales = await fetch(`/api/rivales/torneo/${torneoId}`);
    const dataRivales = await resRivales.json();
    setRivales(dataRivales);
  };
  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre.trim()) 
      nuevosErrores.nombre = true;
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
      const res = await fetch('/api/rivales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const rival = await res.json();
        const data = {
            rival_id: rival.id,
            torneo_id: torneoSeleccionado
        };
        const resRivalTorneo = await fetch('/api/rivales/torneo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (resRivalTorneo.ok) {
          setMensaje('✅ Rival creado correctamente');
          setForm({
            nombre: ''
          });
          setErrores({});
          fetchRivales(torneoSeleccionado);
          fetchTorneos();
        }
      } else {
        setMensaje('❌ Error al crear Rival compruebe si ya existe');
      }
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al conectar con el servidor');
    }
  };
  
  return (
    <div className="min-h-screen bg-orange-50 p-6">
    <h1 className="text-3xl font-bold text-orange-700 mb-6 text-center">
    Agregar Rival
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
    value={form.nombre.toUpperCase()}
    onChange={handleChange}
    className={`w-full border p-2 rounded ${errores.nombre ? 'border-red-500' : ''}`}
    />
    </div>
    
    <Torneo torneoSeleccionado={torneoSeleccionado} torneosDisponibles={torneosDisponibles} functionCallback={buscarRivales}/>

    <div>
    <label className="block text-sm font-medium text-orange-700 mb-1">Rival *</label>
    <select
    className="w-full p-2 border rounded text-sm"
    >
    <option value="seleccione rival">Rivales</option>
    {rivales.map((rival) => (
      <option key={rival.id} value={rival.id}>
      {rival.nombre}
      </option>
    ))}
    </select>
    </div>
    <button
    type="submit"
    className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 font-semibold"
    >
    Guardar Rival
    </button>
    
    {mensaje && <p className="text-sm text-center mt-2">{mensaje}</p>}
    </form>
    </div>
  );
};

export default AdminRivales;