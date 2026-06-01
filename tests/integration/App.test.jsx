import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';
import { getTrucks, createTruck, updateTruck, deleteTruck } from '../../src/services/api';

vi.mock('../../src/services/api');
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
  },
}));

import Swal from 'sweetalert2';

const mockTrucks = [
  {
    _id: '1',
    modelo: 'Volvo FH16',
    matricula: 'ABC-1234',
    hora_llegada: '2024-01-15T10:30:00.000Z',
    carga_contenida: 'Electrodomesticos',
  },
];

describe('App (integracion)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe cargar y mostrar los camiones al iniciar', async () => {
    getTrucks.mockResolvedValue({ data: mockTrucks });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Volvo FH16')).toBeInTheDocument();
    });

    expect(screen.getByText('ABC-1234')).toBeInTheDocument();
    expect(screen.getByText('Electrodomesticos')).toBeInTheDocument();
  });

  it('debe mostrar el titulo principal', () => {
    getTrucks.mockResolvedValue({ data: [] });
    render(<App />);
    expect(screen.getByText('Registro de Llegada de Camiones')).toBeInTheDocument();
  });

  it('debe crear un nuevo camion y refrescar la lista', async () => {
    getTrucks.mockResolvedValue({ data: [] });
    createTruck.mockResolvedValue({ success: true });

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(getTrucks).toHaveBeenCalled();
    });

    await user.type(screen.getByLabelText(/modelo/i), 'Mercedes Actros');
    await user.type(screen.getByLabelText(/matricula/i), 'XYZ-9999');
    await user.type(screen.getByLabelText(/carga contenida/i), 'Ropa');

    await user.click(screen.getByText('Registrar'));

    await waitFor(() => {
      expect(createTruck).toHaveBeenCalled();
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      'Registrado',
      'Camion registrado correctamente',
      'success'
    );
  });

  it('debe editar un camion existente', async () => {
    getTrucks.mockResolvedValue({ data: mockTrucks });
    updateTruck.mockResolvedValue({ success: true });

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Volvo FH16')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Editar');
    await user.click(editButtons[0]);

    expect(screen.getByText('Editar Camion')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByLabelText(/modelo/i).value).toBe('Volvo FH16');
    });

    await user.clear(screen.getByLabelText(/modelo/i));
    await user.type(screen.getByLabelText(/modelo/i), 'Volvo Actualizado');

    await user.click(screen.getByText('Actualizar'));

    await waitFor(() => {
      expect(updateTruck).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({ modelo: 'Volvo Actualizado' })
      );
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      'Actualizado',
      'Registro actualizado correctamente',
      'success'
    );
  });

  it('debe eliminar un camion al confirmar', async () => {
    getTrucks.mockResolvedValue({ data: mockTrucks });
    deleteTruck.mockResolvedValue({ success: true });
    Swal.fire.mockResolvedValue({ isConfirmed: true });

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Volvo FH16')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Eliminar');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteTruck).toHaveBeenCalledWith('1');
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      'Eliminado',
      'Registro eliminado correctamente',
      'success'
    );
  });

  it('debe pedir confirmacion antes de eliminar', async () => {
    getTrucks.mockResolvedValue({ data: mockTrucks });
    Swal.fire.mockResolvedValue({ isConfirmed: false });

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Volvo FH16')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Eliminar');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Eliminar registro?' })
      );
    });

    expect(deleteTruck).not.toHaveBeenCalled();
  });

  it('debe mostrar un error si la carga inicial falla', async () => {
    getTrucks.mockRejectedValue(new Error('Error de conexion'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Error de conexion')).toBeInTheDocument();
    });
  });
});
