import { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import TruckForm from './components/TruckForm';
import TruckList from './components/TruckList';
import { useTrucks } from './hooks/useTrucks';
import { createTruck, updateTruck, deleteTruck } from './services/api';

function App() {
  const { trucks, loading, error, refresh, setError } = useTrucks();
  const [editingTruck, setEditingTruck] = useState(null);
  const formRef = useRef(null);

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

  const handleEdit = (truck) => {
    setEditingTruck(truck);
    setTimeout(() => formRef.current?.focus(), 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <header>
          <a href="#contenido-principal" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded-md z-50">
            Saltar al contenido principal
          </a>
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Registro de Llegada de Camiones
          </h1>
        </header>

        {error && (
          <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={() => setError(null)}
              aria-label="Cerrar mensaje de error"
              className="float-right font-bold"
            >
              &times;
            </button>
          </div>
        )}

        <main id="contenido-principal">
          <TruckForm
            ref={formRef}
            key={editingTruck?._id || 'new'}
            onSubmit={handleSubmit}
            initialData={editingTruck}
            onCancel={() => setEditingTruck(null)}
          />

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center" role="status" aria-label="Cargando registros">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Cargando registros...</p>
            </div>
          ) : (
            <TruckList
              trucks={trucks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
