const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getTrucks = async () => {
  const response = await fetch(`${API_URL}/trucks`);
  if (!response.ok) throw new Error('Error al obtener camiones');
  return response.json();
};

export const createTruck = async (truck) => {
  const response = await fetch(`${API_URL}/trucks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(truck),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear registro');
  }
  return response.json();
};

export const updateTruck = async (id, truck) => {
  const response = await fetch(`${API_URL}/trucks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(truck),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar registro');
  }
  return response.json();
};

export const deleteTruck = async (id) => {
  const response = await fetch(`${API_URL}/trucks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar registro');
  return response.json();
};
