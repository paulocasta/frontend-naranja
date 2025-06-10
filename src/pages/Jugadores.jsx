import { useEffect, useState } from 'react';
import JugadorCard from '../components/JugadorCard';
import TopGoleadores from '../components/TopGoleadores';
import {
  Shield,
  Goal,
  Hand,
  Users,
  ClipboardList
} from 'lucide-react';

const tabs = [
  { id: 'todos', label: 'Todos', icon: ClipboardList },
  { id: 'arquero', label: 'Arqueros', icon: Hand },
  { id: 'defensa', label: 'Defensores', icon: Shield },
  { id: 'mediocampo', label: 'Mediocampistas', icon: Users },
  { id: 'delantero', label: 'Delanteros', icon: Goal }
];

const Jugadores = () => {
  const [jugadores, setJugadores] = useState([]);
  const [activeTab, setActiveTab] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [totalPartidos, setTotalPartidos] = useState(0);
  const [mesesDisponibles, setMesesDisponibles] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState();
  const anioActual = new Date().getFullYear();
  
  useEffect(() => {
    const fetchAniosPartidos = async () => {
      const res = await fetch('/api/partido/totalAnios/');
      const data = await res.json();
      setMesesDisponibles(data);
    };

    setMesSeleccionado(anioActual);
    fetchAniosPartidos(); 
    fetchPartidos(anioActual);
    fetchJugadores(anioActual);
  }, [anioActual]);

  const handleChange = async (anio) => {
    if (isNaN(anio)) 
      return
    if (anio !== mesSeleccionado) {
      setMesSeleccionado(anio);

      try {
        fetchPartidos(anio);
        fetchJugadores(anio);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const fetchJugadores = async (anio) => {
    const res = await fetch(`/api/estadisticas/jugadores/${anio}`);
    const ordenados = await res.json();
    setJugadores(ordenados);
  };

    const fetchPartidos = async (anio) => {
      const res = await fetch(`/api/partido/totalPartidos/${anio}`);
      const data = await res.json();
      setTotalPartidos(data);
    };

  const filtrarPorPosicion = (j) => {
    const pos = j.posicion_inicial?.toLowerCase();
    const pos_sec = j.posicion_secundaria?.toLowerCase();
    
    switch (activeTab) {
      case 'arquero':
        return pos.includes('arquero') || pos_sec.includes('arquero');
      case 'defensa':
        return pos.includes('defensor') || pos_sec.includes('defensor');
      case 'mediocampo':
        return pos.includes('medio') || pos_sec.includes('medio');
      case 'delantero':
        return pos.includes('delantero') || pos_sec.includes('delantero');
      default:
        return true;
    }
  };

  const jugadoresFiltrados = jugadores
  .filter(filtrarPorPosicion)
  .filter((j) => {
    const query = busqueda.toLowerCase();
    return (
      j.nombre.toLowerCase().includes(query) ||
      j.numero.toString() === query
    );
  });

  const resumen = jugadoresFiltrados.reduce(
    (acc, j) => {
      acc.goles += parseInt(j.goles) || 0;
      acc.asistencias += parseInt(j.asistencias) || 0;
      acc.amarillas += parseInt(j.tarjetas_amarillas) || 0;
      acc.rojas += parseInt(j.tarjetas_rojas) || 0;
      return acc;
    },
    { goles: 0, asistencias: 0, amarillas: 0, rojas: 0, partidos: totalPartidos }
  );

  return (
    
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-4xl font-bold text-orange-700 mb-6 text-center">
        Naranja Mecánica — Jugadores
      </h1>

      <div className="max-w-sm mx-auto mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o número..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-2 border rounded text-sm"
        />

      {/* Filtro por mes */}
      <div className="max-w-xl mx-auto mb-6">
        <select
          className="mt-2 w-full p-2 border rounded text-sm"
          value={mesSeleccionado}
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value="Seleccione un año">Seleccione un año</option>
            {mesesDisponibles.map((mes) => (
              <option key={mes} value={mes}>
                {mes}
              </option>
            ))}
          </select>
        </div>

      </div>
      
      {/* Tabs por posición */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${
              activeTab === id
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white text-orange-700 border-orange-300 hover:bg-orange-100'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Resumen estadístico por posición */}
      {jugadoresFiltrados.length > 0 && (
        <div className="max-w-3xl mx-auto mb-8 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center text-sm font-semibold">
          <div className="bg-white p-3 rounded-xl shadow border border-orange-100">
            <p className="text-orange-600 text-xs">Goles</p>
            <p className="text-xl">{resumen.goles}</p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow border border-orange-100">
            <p className="text-orange-600 text-xs">Asistencias</p>
            <p className="text-xl">{resumen.asistencias}</p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow border border-orange-100">
            <p className="text-orange-600 text-xs">Amarillas</p>
            <p className="text-xl">{resumen.amarillas}</p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow border border-orange-100">
            <p className="text-orange-600 text-xs">Rojas</p>
            <p className="text-xl">{resumen.rojas}</p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow border border-orange-100 col-span-2 sm:col-span-1">
            <p className="text-orange-600 text-xs">Partidos</p>
            <p className="text-xl">{resumen.partidos}</p>
          </div>
        </div>
      )}

      {/* Cards de jugador */}
      <div className="flex flex-wrap gap-6 justify-center">
        {jugadoresFiltrados.map((jugador) => (
          <JugadorCard key={jugador.id} jugador={jugador} />
        ))}
      </div>

      <TopGoleadores anio={mesSeleccionado}/>
    </div>
  );
};

export default Jugadores;
