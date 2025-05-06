import { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [jugadores, setJugadores] = useState([]);
  const [rival, setRival] = useState('');
  const [fecha, setFecha] = useState('');
  const [golesEquipo, setGolesEquipo] = useState(0);
  const [golesRival, setGolesRival] = useState(0);
  const [estadisticas, setEstadisticas] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({ rival: false, fecha: false });

  useEffect(() => {
    const fetchJugadores = async () => {
      const res = await fetch('/api/jugador');
      const data = await res.json();
      setJugadores(data);
      setEstadisticas(
        Object.fromEntries(data.map(j => [j.id, {
          goles: 0, asistencias: 0, tarjetas_amarillas: 0, tarjetas_rojas: 0
        }]))
      );
    };
    fetchJugadores();
  }, []);

  const handleStatChange = (jugadorId, campo, valor) => {
    setEstadisticas(prev => ({
      ...prev,
      [jugadorId]: { ...prev[jugadorId], [campo]: parseInt(valor) || 0 }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroresActuales = {
      rival: !rival.trim(),
      fecha: !fecha.trim()
    };
    setErrores(erroresActuales);

    if (erroresActuales.rival || erroresActuales.fecha) {
      setMensaje('❌ Por favor, completá todos los campos obligatorios.');
      return;
    }

    const resPartido = await fetch('/api/partido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rival, fecha, goles_equipo: golesEquipo, goles_rival: golesRival })
    });

    const partido = await resPartido.json();

    if (!resPartido.ok) {
      alert('Error creando partido');
      return;
    }

    for (const jugadorId in estadisticas) {
      const stats = estadisticas[jugadorId];
      const { goles, asistencias, tarjetas_amarillas, tarjetas_rojas } = stats;

      if (goles || asistencias || tarjetas_amarillas || tarjetas_rojas) {
        await fetch('/api/estadisticas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jugador_id: jugadorId,
            partido_id: partido.id,
            goles, asistencias, tarjetas_amarillas, tarjetas_rojas
          })
        });
      }
    }

    setMensaje('✅ Partido y estadísticas guardadas correctamente');
    setRival('');
    setFecha('');
    setGolesEquipo(0);
    setGolesRival(0);
    setErrores({ rival: false, fecha: false });
    setEstadisticas(
      Object.fromEntries(jugadores.map(j => [j.id, {
        goles: 0, asistencias: 0, tarjetas_amarillas: 0, tarjetas_rojas: 0
      }]))
    );
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-3xl font-bold text-orange-700 mb-6 text-center">Panel de Administración</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6 space-y-6">

        {/* Datos del partido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-orange-700 mb-1">Rival *</label>
            <input
              type="text"
              value={rival}
              onChange={e => setRival(e.target.value)}
              className={`w-full border p-2 rounded ${errores.rival ? 'border-red-500' : ''}`}
              required
            />
            {errores.rival && <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-700 mb-1">Fecha *</label>
            <input
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              className={`w-full border p-2 rounded ${errores.fecha ? 'border-red-500' : ''}`}
              required
            />
            {errores.fecha && <p className="text-xs text-red-600 mt-1">Este campo es obligatorio</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-700 mb-1">Goles del equipo</label>
            <input
              type="number"
              value={golesEquipo}
              onChange={e => setGolesEquipo(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-700 mb-1">Goles del rival</label>
            <input
              type="number"
              value={golesRival}
              onChange={e => setGolesRival(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Estadísticas por jugador */}
        <div className="overflow-x-auto">
          <h2 className="text-xl font-bold text-orange-600 mb-3">Estadísticas por jugador</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th>Jugador</th>
                <th>Goles</th>
                <th>Asistencias</th>
                <th>Amarillas</th>
                <th>Rojas</th>
              </tr>
            </thead>
            <tbody>
              {jugadores.map(j => (
                <tr key={j.id} className="border-b last:border-none">
                  <td className="py-1">{j.nombre} {j.apellido}</td>
                  <td><input type="number" min="0" value={estadisticas[j.id]?.goles || 0}
                    onChange={e => handleStatChange(j.id, 'goles', e.target.value)} className="w-16 border rounded p-1" /></td>
                  <td><input type="number" min="0" value={estadisticas[j.id]?.asistencias || 0}
                    onChange={e => handleStatChange(j.id, 'asistencias', e.target.value)} className="w-16 border rounded p-1" /></td>
                  <td><input type="number" min="0" value={estadisticas[j.id]?.tarjetas_amarillas || 0}
                    onChange={e => handleStatChange(j.id, 'tarjetas_amarillas', e.target.value)} className="w-16 border rounded p-1" /></td>
                  <td><input type="number" min="0" value={estadisticas[j.id]?.tarjetas_rojas || 0}
                    onChange={e => handleStatChange(j.id, 'tarjetas_rojas', e.target.value)} className="w-16 border rounded p-1" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded font-semibold">
          Guardar partido
        </button>

        {mensaje && <p className="text-center font-semibold mt-2">{mensaje}</p>}
      </form>
    </div>
  );
};

export default AdminPanel;
