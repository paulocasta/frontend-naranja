const RankingTable = ({ titulo, label, icono: Icono, datos, campoValor }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <Icono className="text-orange-600" size={20} />
        <h2 className="text-xl font-bold text-orange-600">{titulo}</h2>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th>#</th>
            <th>Jugador</th>
            <th className="text-right">{label}</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((jugador, index) => (
            <tr key={jugador.id} className="border-b last:border-none">
              <td className="py-2">{index + 1}</td>
              <td>{jugador.nombre} {jugador.apellido}</td>
              <td className="text-right font-semibold">
                {jugador[campoValor.toLowerCase()]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingTable;
