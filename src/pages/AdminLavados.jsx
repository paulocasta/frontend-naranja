import { useEffect, useState } from 'react';

const AdminLavados = () => {
  const [jugadores, setJugadores] = useState([]);
  const [jugadorId, setJugadorId] = useState('');
  const [fecha, setFecha] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resJugadores = await fetch('/api/jugador');
      const dataJugadores = await resJugadores.json();
      setJugadores(dataJugadores);

      const resLavados = await fetch('/api/lavados');
      const dataLavados = await resLavados.json();
      setHistorial(dataLavados);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jugadorId || !fecha) {
      setMensaje('❌ Seleccioná un jugador y una fecha.');
      return;
    }

    try {
      const res = await fetch('/api/lavados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jugador_id: jugadorId, fecha })
      });

      if (res.ok) {
        setMensaje('✅ Lavado registrado correctamente.');
        setJugadorId('');
        setFecha('');

        // Actualizar historial después de registrar
        const resLavados = await fetch('/api/lavados');
        const dataLavados = await resLavados.json();
        setHistorial(dataLavados);
      } else {
        setMensaje('❌ Error al registrar el lavado.');
      }
    } catch (err) {
      setMensaje('❌ Error de conexión con el servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-2xl font-bold text-orange-700 text-center mb-6">
        Registrar Lavado de Camiseta
      </h1>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-4 mb-10">
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Jugador</label>
          <select
            value={jugadorId}
            onChange={(e) => setJugadorId(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Seleccionar jugador</option>
            {jugadores.map((j) => (
              <option key={j.id} value={j.id}>
                {j.nombre} {j.apellido}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button type="submit" className="bg-orange-600 text-white w-full py-2 rounded font-semibold hover:bg-orange-700">
          Guardar lavado
        </button>

        {mensaje && <p className="text-sm text-center mt-2">{mensaje}</p>}
      </form>

      {/* Historial */}
      <div className="max-w-2xl mx-auto bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold text-orange-600 mb-3 text-center">Historial de Lavados</h2>
        {historial.length === 0 ? (
          <p className="text-center text-sm text-gray-500">Aún no hay lavados registrados.</p>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-orange-100">
              <tr className="text-left">
                <th className="p-2">Fecha</th>
                <th>Jugador</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="p-2">{new Date(l.fecha).toLocaleDateString()}</td>
                  <td>{l.nombre} {l.apellido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminLavados;
