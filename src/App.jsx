import { useState, useEffect } from 'react';
import TruckForm from './components/TruckForm';
import TruckList from './components/TruckList';
import { getTrucks, createTruck, updateTruck, deleteTruck } from './services/api';

function App() {
  const [trucks, setTrucks] = useState([]);
  const [editingTruck, setEditingTruck] = useState(null);
  const [error, setError] = useState(null);

  const loadTrucks = async () => {
    try {
      const data = await getTrucks();
      setTrucks(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadTrucks();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (editingTruck) {
        await updateTruck(editingTruck._id, formData);
        setEditingTruck(null);
      } else {
        await createTruck(formData);
      }
      await loadTrucks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminar este registro?')) return;
    try {
      await deleteTruck(id);
      await loadTrucks();
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
