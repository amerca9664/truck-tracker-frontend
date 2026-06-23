const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getTrucks = async ({ page = 1, limit = 10, search = '', dateFrom = '', dateTo = '' } = {}) => {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  if (search) params.set('search', search);
  if (dateFrom) params.set('dateFrom', dateFrom);
  if (dateTo) params.set('dateTo', dateTo);

  const response = await fetch(`${API_URL}/trucks?${params.toString()}`);
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

export const uploadExcel = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload/excel`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al subir el archivo');
  }
  return response.json();
};
