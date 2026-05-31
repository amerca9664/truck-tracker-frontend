import { useState } from 'react';
import Swal from 'sweetalert2';
import TruckForm from './components/TruckForm';
import TruckList from './components/TruckList';
import { useTrucks } from './hooks/useTrucks';
import { createTruck, updateTruck, deleteTruck } from './services/api';

function App() {
  const { trucks, error, refresh, setError } = useTrucks();
  const [editingTruck, setEditingTruck] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      if (editingTruck) {
        await updateTruck(editingTruck._id, formData);
        setEditingTruck(null);
        Swal.fire('Actualizado', 'Registro actualizado correctamente', 'success');
      } else {
        await createTruck(formData);
        Swal.fire('Registrado', 'Camion registrado correctamente', 'success');
      }
      refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Eliminar registro?',
      text: 'No podras revertir esta accion',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      await deleteTruck(id);
      Swal.fire('Eliminado', 'Registro eliminado correctamente', 'success');
      refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Registro de Llegada de Camiones
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button onClick={() => setError(null)} className="float-right font-bold">
              &times;
            </button>
          </div>
        )}

        <TruckForm
          onSubmit={handleSubmit}
          initialData={editingTruck}
          onCancel={() => setEditingTruck(null)}
        />

        <TruckList
          trucks={trucks}
          onEdit={setEditingTruck}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;
