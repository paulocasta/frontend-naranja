import { useEffect, useState } from 'react';
import { CalendarDays, ShieldCheck, Clock8, Flag } from 'lucide-react';

const Calendario = () => {
  const [partidos, setPartidos] = useState([]);
  const [mesesDisponibles, setMesesDisponibles] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState('todos');

  useEffect(() => {
    const fetchPartidos = async () => {
      const res = await fetch('/api/partido');
      const data = await res.json();

      const ordenados = data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      setPartidos(ordenados);

      const mesesUnicos = Array.from(
        new Set(
          ordenados.map((p) =>
            new Date(p.fecha).toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })
          )
        )
      );
      setMesesDisponibles(mesesUnicos);
    };

    fetchPartidos();
  }, []);

  const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const partidosFiltrados =
    mesSeleccionado === 'todos'
      ? partidos
      : partidos.filter(
          (p) =>
            new Date(p.fecha).toLocaleDateString('es-AR', { year: 'numeric', month: 'long' }) ===
            mesSeleccionado
        );

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="flex items-center justify-center gap-2 mb-6">
        <CalendarDays className="text-orange-700" size={28} />
        <h1 className="text-3xl font-bold text-orange-700">Calendario de Partidos</h1>
      </div>

      {/* Filtro por mes */}
      <div className="max-w-xl mx-auto mb-6">
        <select
          className="w-full p-2 border rounded text-sm"
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
        >
          <option value="todos">Todos los meses</option>
          {mesesDisponibles.map((mes) => (
            <option key={mes} value={mes}>
              {mes[0].toUpperCase() + mes.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de partidos */}
      <div className="max-w-3xl mx-auto space-y-4">
        {partidosFiltrados.map((p) => {
          const jugado = p.goles_equipo !== null && p.goles_rival !== null;
          const IconoEstado = jugado ? ShieldCheck : Clock8;

          return (
            <div
              key={p.id}
              className={`p-4 rounded-xl shadow flex justify-between items-center ${
                jugado ? 'bg-white' : 'bg-yellow-100'
              } border-l-4 ${jugado ? 'border-green-500' : 'border-yellow-500'}`}
            >
              <div className="flex items-center gap-3">
                <IconoEstado className={`text-${jugado ? 'green' : 'yellow'}-600`} />
                <div>
                  <p className="text-sm text-gray-500">{formatFecha(p.fecha)}</p>
                  <div className="flex items-center gap-1 font-semibold">
                    <Flag className="w-4 h-4 text-orange-600" />
                    vs {p.rival}
                  </div>
                </div>
              </div>
              <div className="text-right font-bold text-orange-700 text-xl">
                {jugado ? `${p.goles_equipo} - ${p.goles_rival}` : 'Por jugar'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendario;
