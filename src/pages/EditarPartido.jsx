import { useEffect, useState } from 'react';

const EditarPartido = () => {
  const [partidos, setPartidos] = useState([]);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState('');
  const [estadisticas, setEstadisticas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [jugadores, setJugadores] = useState([]);
  const [nuevoJugadorId, setNuevoJugadorId] = useState('');    
  const [nuevoStats, setNuevoStats] = useState({
    goles: 0,
    asistencias: 0,
    tarjetas_amarillas: 0,
    tarjetas_rojas: 0,
    asistio: false
  });

  useEffect(() => {
    const fetchPartidos = async () => {
      const res = await fetch('/api/partido');
      const data = await res.json();
      const ordenados = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setPartidos(ordenados);
    };
    fetchPartidos();
  }, []);

  const cargarEstadisticas = async (partidoId) => {
    const res = await fetch(`/api/estadisticas/partido/${partidoId}`);
    const data = await res.json();
    setEstadisticas(data);
    fetchJugadores(partidoId);
  };

  const fetchJugadores = async (partidoId) => {
    const res = await fetch(`/api/estadisticas/jugador/partido/${partidoId}`);
    const data = await res.json();
    setJugadores(data);
  };

  const handleEditar = (id, campo, valor) => {
    setEstadisticas((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, [campo]: parseInt(valor) || 0 } : e
      )
    );
  };
  const handleEditarCheck = (id, campo, valor) => {
    console.log('handleEditarCheck', valor);
    setEstadisticas((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, [campo]: valor || false } : e
      )
    );
  };

  const guardarCambios = async (id, datos) => {
    const res = await fetch(`/api/estadisticas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (res.ok) {
      setMensaje('✅ Estadística actualizada.');
    } else {
      setMensaje('❌ Error al actualizar.');
    }
  };

  const eliminarEstadistica = async (id) => {
    if (!window.confirm('¿Eliminar esta estadística?')) return;
    const res = await fetch(`/api/estadisticas/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setEstadisticas((prev) => prev.filter((e) => e.id !== id));
      setMensaje('✅ Estadística eliminada.');
    } else {
      setMensaje('❌ Error al eliminar.');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-2xl font-bold text-orange-700 mb-6 text-center">Editar Partido</h1>

      <div className="max-w-xl mx-auto mb-6">
        <label className="block text-sm font-medium text-orange-700 mb-1">Seleccionar partido</label>
        <select
          value={partidoSeleccionado}
          onChange={(e) => {
            setPartidoSeleccionado(e.target.value);
            cargarEstadisticas(e.target.value);
          }}
          className="w-full border p-2 rounded"
        >
          <option value="">Elegir...</option>
          {partidos.map((p) => (
            <option key={p.id} value={p.id}>
              {new Date(p.fecha).toLocaleDateString()} vs {p.rival}
            </option>
          ))}
        </select>
      </div>

      {mensaje && <p className="text-center text-sm mb-4">{mensaje}</p>}

      {estadisticas.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-bold text-orange-600 mb-3 text-center">Estadísticas</h2>
          <table className="w-full text-sm border">
            <thead className="bg-orange-100 text-left">
              <tr>
                <th className="p-2">Jugador</th>
                <th>Goles</th>
                <th>Asist.</th>
                <th>Ama.</th>
                <th>Rojas</th>
                <th>Atajo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {estadisticas.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-2 font-medium">{e.nombre} {e.apellido}</td>
                  <td>
                    <input type="number" value={e.goles} min="0"
                      onChange={(ev) => handleEditar(e.id, 'goles', ev.target.value)}
                      className="w-14 border p-1 rounded" />
                  </td>
                  <td>
                    <input type="number" value={e.asistencias} min="0"
                      onChange={(ev) => handleEditar(e.id, 'asistencias', ev.target.value)}
                      className="w-14 border p-1 rounded" />
                  </td>
                  <td>
                    <input type="number" value={e.tarjetas_amarillas} min="0"
                      onChange={(ev) => handleEditar(e.id, 'tarjetas_amarillas', ev.target.value)}
                      className="w-14 border p-1 rounded" />
                  </td>
                  <td>
                    <input type="number" value={e.tarjetas_rojas} min="0"
                      onChange={(ev) => handleEditar(e.id, 'tarjetas_rojas', ev.target.value)}
                      className="w-14 border p-1 rounded" />
                  </td>
                     <td>
                    <input type="checkbox" defaultChecked={e.atajo || false}
                      onChange={(ev) => handleEditarCheck(e.id, 'atajo', ev.target.checked)}
                      className="w-14 border p-1 rounded" />
                  </td>
                  <td className="flex gap-2 items-center mt-1">
                    <button
                      onClick={() =>
                        guardarCambios(e.id, {
                          goles: e.goles,
                          asistencias: e.asistencias,
                          tarjetas_amarillas: e.tarjetas_amarillas,
                          tarjetas_rojas: e.tarjetas_rojas,
                          atajo: e.atajo
                        })
                      }
                      className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => eliminarEstadistica(e.id)}
                      className="text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
                    <div className="mt-6 pt-4 border-t">
            <h3 className="text-md font-bold text-orange-700 mb-3">Agregar jugador al partido</h3>
            <form
                onSubmit={async (e) => {
                e.preventDefault();
                if (!nuevoJugadorId || !partidoSeleccionado) return;

                const res = await fetch('/api/estadisticas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                    jugador_id: nuevoJugadorId,
                    partido_id: partidoSeleccionado,
                    ...nuevoStats
                    })
                });

                if (res.ok) {
                    setMensaje('✅ Jugador agregado.');
                    cargarEstadisticas(partidoSeleccionado);
                    setNuevoJugadorId('');
                    setNuevoStats({ goles: 0, asistencias: 0, tarjetas_amarillas: 0, tarjetas_rojas: 0 });
                } else {
                    setMensaje('❌ Error al agregar jugador.');
                }
                }}
                className="flex flex-wrap items-center gap-3"
            >
                <select
                value={nuevoJugadorId}
                onChange={(e) => setNuevoJugadorId(e.target.value)}
                className="border p-2 rounded"
                >
                <option value="">Seleccionar jugador</option>
                {jugadores.map(j => (
                    <option key={j.id} value={j.id}>{j.nombre} {j.apellido}</option>
                ))}
                </select>

                {['goles', 'asistencias', 'tarjetas_amarillas', 'tarjetas_rojas'].map((campo) => (
                <input
                    key={campo}
                    type="number"
                    min="0"
                    value={nuevoStats[campo]}
                    onChange={(e) =>
                    setNuevoStats((prev) => ({ ...prev, [campo]: parseInt(e.target.value) || 0 }))
                    }
                    placeholder={campo}
                    className="w-24 border p-1 rounded"
                />
                ))}

                <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                Agregar
                </button>
            </form>
            </div>

        </div>
      )}
    </div>
  );
};

export default EditarPartido;
