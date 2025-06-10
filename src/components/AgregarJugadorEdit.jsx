import { useEffect, useState } from 'react';

const AgregarJugadorEdit = (partido, setMensaje) => {
    console.log('partido', partido);
    const [jugadores, setJugadores] = useState([]);
    const [partidoSeleccionado, setPartidoSeleccionado] = useState([]);
    const [nuevoJugadorId, setNuevoJugadorId] = useState('');    
    const [nuevoStats, setNuevoStats] = useState({
        goles: 0,
        asistencias: 0,
        tarjetas_amarillas: 0,
        tarjetas_rojas: 0,
    });
    useEffect(() => {
        const {partidoSeleccionado} = partido;
        const fetchJugadoresAusentes = async () => {
            const res = await fetch(`/api/estadisticas/jugador/partido/${partidoSeleccionado}`);
            const data = await res.json();
            //setJugadores(data);
        };
        fetchJugadoresAusentes();
     
      
    });
    return (
    <div className="mt-6 pt-4 border-t">
        <h3 className="text-md font-bold text-orange-700 mb-3">Agregar jugador al partido</h3>
        <form
            onSubmit={async (e) => {
            e.preventDefault();
            if (!nuevoJugadorId || !partidoSeleccionado) 
                return;

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
    );
};

export default AgregarJugadorEdit;