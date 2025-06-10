import { useEffect, useState } from 'react';
import TopCard from './TopCard';

const TopGoleadores = (anioActual) => {
  const [goleadores, setGoleadores] = useState([]);
  const {anio} = anioActual;
  useEffect(() => {
    const fetchTop = async () => {
      const res = await fetch(`/api/rankings/top3/${anio}`);
      const data = await res.json();
      setGoleadores(data.slice(0, 3)); // Top 3
    };

    fetchTop();
  }, [anio]);
  
  return (
    <div className="bg-orange-100 py-8 px-4 mt-4">
      <h2 className="text-2xl font-bold text-orange-700 text-center mb-6">
        🏆 Top 3 Goleadores
      </h2>

      <div className="flex flex-wrap justify-center gap-6">
        {goleadores.map((jugador, index) => (
          <TopCard
            key={jugador.id}
            jugador={jugador}
            rankingGoleador={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default TopGoleadores;
