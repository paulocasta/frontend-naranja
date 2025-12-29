
const Torneo = ({torneoSeleccionado, torneosDisponibles, functionCallback}) => {
    return (      
    <div>
        <label className="block text-sm font-medium text-orange-700 mb-1">Torneo *</label>
        <select
            className="w-full p-2 border rounded text-sm"
            value={torneoSeleccionado}
            onChange={(e) => functionCallback(e.target.value)}
        >
            <option value="seleccione torneo">Seleccione Torneo</option>
            {torneosDisponibles.map((torneo) => (
            <option key={torneo.id} value={torneo.id}>
                {torneo.anio}-{torneo.tipo}
            </option>
            ))}
        </select>
    </div>
    );
};
export default Torneo;