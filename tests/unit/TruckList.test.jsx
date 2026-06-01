import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TruckList from '../../src/components/TruckList';

const mockTrucks = [
  {
    _id: '1',
    modelo: 'Volvo FH16',
    matricula: 'ABC-1234',
    hora_llegada: '2024-01-15T10:30:00.000Z',
    carga_contenida: 'Electrodomesticos',
  },
  {
    _id: '2',
    modelo: 'Mercedes Actros',
    matricula: 'XYZ-9876',
    hora_llegada: '2024-01-15T11:45:00.000Z',
    carga_contenida: 'Ropa',
  },
];

describe('TruckList', () => {
  it('debe mostrar mensaje vacio cuando no hay camiones', () => {
    render(<TruckList trucks={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('No hay registros de camiones')).toBeInTheDocument();
  });

  it('debe renderizar la cabecera de la tabla', () => {
    render(<TruckList trucks={mockTrucks} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Modelo')).toBeInTheDocument();
    expect(screen.getByText('Matricula')).toBeInTheDocument();
    expect(screen.getByText('Hora Llegada')).toBeInTheDocument();
    expect(screen.getByText('Carga')).toBeInTheDocument();
  });

  it('debe renderizar una fila por cada camion', () => {
    render(<TruckList trucks={mockTrucks} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Volvo FH16')).toBeInTheDocument();
    expect(screen.getByText('ABC-1234')).toBeInTheDocument();
    expect(screen.getByText('Mercedes Actros')).toBeInTheDocument();
    expect(screen.getByText('XYZ-9876')).toBeInTheDocument();
    expect(screen.getByText('Electrodomesticos')).toBeInTheDocument();
    expect(screen.getByText('Ropa')).toBeInTheDocument();
  });

  it('debe llamar onEdit con el camion al hacer click en editar', async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(<TruckList trucks={mockTrucks} onEdit={onEdit} onDelete={vi.fn()} />);

    const editButtons = screen.getAllByText('Editar');
    await user.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledWith(mockTrucks[0]);
  });

  it('debe llamar onDelete con el id al hacer click en eliminar', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<TruckList trucks={mockTrucks} onEdit={vi.fn()} onDelete={onDelete} />);

    const deleteButtons = screen.getAllByText('Eliminar');
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('debe formatear la fecha de llegada', () => {
    render(<TruckList trucks={mockTrucks} onEdit={vi.fn()} onDelete={vi.fn()} />);
    const cells = screen.getAllByRole('cell');
    const dateCell = cells.find((c) => c.textContent.includes('2024'));
    expect(dateCell).toBeInTheDocument();
  });
});
