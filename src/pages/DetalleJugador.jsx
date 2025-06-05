import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DetalleJugador = () => {
  const { id } = useParams();
  const [jugador, setJugador] = useState(null);
  const [partidos, setPartidos] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      const resJugador = await fetch(`/api/jugador/${id}/estadisticas`);
      const dataJugador = await resJugador.json();
      setJugador(dataJugador);

      const resHistorial = await fetch(`/api/estadisticas/jugador/${id}`);
      const dataHistorial = await resHistorial.json();
      setPartidos(dataHistorial);
    };

    fetchDatos();
  }, [id]);

  if (!jugador) return <p className="p-6 text-center">Cargando jugador...</p>;

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col items-center mb-6">
          <img src={jugador.foto_url} className="w-32 h-32 rounded-full border-4 border-orange-600 object-cover" />
          <h1 className="text-3xl font-bold text-orange-700 mt-2">{jugador.nombre}</h1>
          <p className="text-sm text-gray-600">{jugador.posicion}</p>
          <p className="text-sm text-gray-500"># {jugador.numero}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center text-sm font-semibold mb-6">
          <div><p className="text-orange-600 text-xs">Goles</p><p className="text-lg">{jugador.goles}</p></div>
          <div><p className="text-orange-600 text-xs">Asistencias</p><p className="text-lg">{jugador.asistencias}</p></div>
          <div><p className="text-orange-600 text-xs">Amarillas</p><p className="text-lg">{jugador.tarjetas_amarillas}</p></div>
          <div><p className="text-orange-600 text-xs">Rojas</p><p className="text-lg">{jugador.tarjetas_rojas}</p></div>
          <div className="col-span-2 sm:col-span-1"><p className="text-orange-600 text-xs">Partidos</p><p className="text-lg">{jugador.partidos_jugados}</p></div>
        </div>

        <h2 className="text-xl font-bold text-orange-600 mb-2">Historial por partido</h2>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-orange-100 text-left">
              <th className="p-2">Fecha</th>
              <th>Rival</th>
              <th>G</th>
              <th>A</th>
              <th>Ama</th>
              <th>Roj</th>
            </tr>
          </thead>
          <tbody>
            {partidos.map((p, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{new Date(p.fecha).toLocaleDateString()}</td>
                <td>{p.rival}</td>
                <td>{p.goles}</td>
                <td>{p.asistencias}</td>
                <td>{p.tarjetas_amarillas}</td>
                <td>{p.tarjetas_rojas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetalleJugador;
