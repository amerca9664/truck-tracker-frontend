import { useState, forwardRef } from 'react';

const INITIAL_STATE = {
  modelo: '',
  matricula: '',
  hora_llegada: new Date().toISOString().slice(0, 16),
  carga_contenida: '',
};

const formatInitialData = (data) => {
  if (!data) return INITIAL_STATE;
  return {
    ...data,
    hora_llegada: data.hora_llegada
      ? data.hora_llegada.slice(0, 16)
      : INITIAL_STATE.hora_llegada,
  };
};

const TruckForm = forwardRef(function TruckForm({ onSubmit, initialData, onCancel }, ref) {
  const [form, setForm] = useState(() => formatInitialData(initialData));
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        hora_llegada: new Date(form.hora_llegada).toISOString(),
      });
      if (!initialData) setForm(INITIAL_STATE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {initialData ? 'Editar Camion' : 'Registrar Llegada'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
          <input
            ref={ref}
            id="modelo"
            type="text"
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Volvo FH16"
          />
        </div>
        <div>
          <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">Matricula</label>
          <input
            id="matricula"
            type="text"
            name="matricula"
            value={form.matricula}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: ABC-1234"
          />
        </div>
        <div>
          <label htmlFor="hora_llegada" className="block text-sm font-medium text-gray-700 mb-1">Hora de Llegada</label>
          <input
            id="hora_llegada"
            type="datetime-local"
            name="hora_llegada"
            value={form.hora_llegada}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="carga_contenida" className="block text-sm font-medium text-gray-700 mb-1">Carga Contenida</label>
          <input
            id="carga_contenida"
            type="text"
            name="carga_contenida"
            value={form.carga_contenida}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej:Electrodomesticos"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Registrar'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
});

export default TruckForm;
