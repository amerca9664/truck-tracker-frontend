import { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import TruckForm from './components/TruckForm';
import TruckList from './components/TruckList';
import Modal from './components/Modal';
import { useTrucks } from './hooks/useTrucks';
import { useDebounce } from './hooks/useDebounce';
import { createTruck, updateTruck, deleteTruck } from './services/api';

function App() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editingTruck, setEditingTruck] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const formRef = useRef(null);

  const search = useDebounce(searchInput);
  const datesComplete = dateFrom && dateTo;

  const { trucks, loading, error, refresh, setError, pagination } = useTrucks({
    page,
    limit: 5,
    search: datesComplete ? search : '',
    dateFrom,
    dateTo,
  });

  const handleSubmit = async (formData) => {
    try {
      if (editingTruck) {
        await updateTruck(editingTruck._id, formData);
        setShowEditModal(false);
        setEditingTruck(null);
        Swal.fire('Actualizado', 'Registro actualizado correctamente', 'success');
      } else {
        await createTruck(formData);
        setShowNewModal(false);
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
    setShowEditModal(true);
  };

  const handleSearch = (value) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleDateFrom = (value) => {
    setDateFrom(value);
    setPage(1);
  };

  const handleDateTo = (value) => {
    setDateTo(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const hasFilters = searchInput || dateFrom || dateTo;

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <button
              onClick={() => setShowNewModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              + Nuevo Camion
            </button>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por modelo, matricula o carga..."
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2 items-center">
                <label htmlFor="date-from" className="sr-only">Desde</label>
                <input
                  id="date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => handleDateFrom(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-400 text-sm">-</span>
                <label htmlFor="date-to" className="sr-only">Hasta</label>
                <input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => handleDateTo(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>

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
              pagination={pagination}
              onPageChange={setPage}
            />
          )}
        </main>
      </div>

      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Registrar Llegada"
      >
        <TruckForm
          ref={formRef}
          onSubmit={handleSubmit}
          onCancel={() => setShowNewModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingTruck(null); }}
        title="Editar Camion"
      >
        {editingTruck && (
          <TruckForm
            ref={formRef}
            key={editingTruck._id}
            onSubmit={handleSubmit}
            initialData={editingTruck}
            onCancel={() => { setShowEditModal(false); setEditingTruck(null); }}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;
