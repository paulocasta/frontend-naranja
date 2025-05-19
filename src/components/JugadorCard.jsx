import { Link } from 'react-router-dom';

const medallas = {
  1: '🥇',
  2: '🥈',
  3: '🥉'
};

const JugadorCard = ({ jugador, rankingGoleador }) => {
  return (
    <Link to={`/jugador/${jugador.id}`} className="hover:no-underline">
      <div className="relative w-64 h-[400px] rounded-2xl shadow-xl overflow-hidden 
        bg-gradient-to-br from-[#FF7F50] via-[#FFA500] to-[#FFD700]
        border-4 border-white
        transform transition-transform duration-300 ease-in-out
        hover:scale-105 hover:shadow-2xl hover:border-yellow-400">
        
        {/* Fondo sutil tipo FIFA */}
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://i.imgur.com/Z0ZkzX0.png)' }}
        ></div>

        {/* Número de camiseta */}
        <div className="absolute top-2 left-3 bg-white text-orange-600 font-bold text-lg rounded-full w-8 h-8 flex items-center justify-center shadow">
          {jugador.numero}
        </div>

        {/* Medalla si está en top goleador */}
        {rankingGoleador && rankingGoleador <= 3 && (
          <div className="absolute top-2 right-3 text-2xl drop-shadow">{medallas[rankingGoleador]}</div>
        )}

        <div className="relative z-10 p-4 flex flex-col h-full justify-between text-white font-sans">

          {/* Nombre y posición */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest opacity-80">
              {jugador.posicion_inicial}
            </p>
            <p className="text-xs uppercase tracking-widest opacity-80">
              {jugador.posicion_secundaria}
            </p>
            <h2 className="text-lg font-bold truncate max-w-[14rem] mx-auto">
              {jugador.nombre} {jugador.apellido}
            </h2>
          </div>

          {/* Foto */}
          <div className="flex justify-center">
            <img
              src={jugador.foto_url || 'https://via.placeholder.com/150'}
              alt={jugador.nombre}
              className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-y-2 bg-white/10 p-3 rounded-xl text-sm">
            <div className="text-center">
              <p className="text-xs opacity-80">Goles</p>
              <p className="text-lg font-bold">{jugador.goles}</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-80">Asistencias</p>
              <p className="text-lg font-bold">{jugador.asistencias}</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-80">Amarillas</p>
              <p className="text-lg font-bold">{jugador.tarjetas_amarillas}</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-80">Rojas</p>
              <p className="text-lg font-bold">{jugador.tarjetas_rojas}</p>
            </div>
            <div className="text-center col-span-2 border-t border-white/20 pt-2 mt-2">
              <p className="text-xs opacity-80">Partidos</p>
              <p className="text-lg font-bold">{jugador.partidos_jugados}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JugadorCard;
