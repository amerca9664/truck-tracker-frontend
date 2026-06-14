export default function TruckList({ trucks, onEdit, onDelete }) {
  if (trucks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        No hay registros de camiones
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <caption className="sr-only">Lista de registros de llegada de camiones</caption>
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Modelo</th>
            <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Matricula</th>
            <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hora Llegada</th>
            <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Carga</th>
            <th scope="col" className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {trucks.map((truck) => (
            <tr key={truck._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-800">{truck.modelo}</td>
              <td className="px-4 py-3 text-sm font-mono font-semibold text-gray-800">{truck.matricula}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(truck.hora_llegada).toLocaleString('es-ES')}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{truck.carga_contenida}</td>
              <td className="px-4 py-3 text-sm text-center">
                <button
                  onClick={() => onEdit(truck)}
                  aria-label={`Editar camión ${truck.matricula}`}
                  className="text-blue-600 hover:text-blue-800 mr-3"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(truck._id)}
                  aria-label={`Eliminar camión ${truck.matricula}`}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
