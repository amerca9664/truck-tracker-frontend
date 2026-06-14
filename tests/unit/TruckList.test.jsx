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

const mockPagination = { total: 10, totalPages: 2, page: 1 };

describe('TruckList', () => {
  it('debe mostrar mensaje vacio cuando no hay camiones', () => {
    render(
      <TruckList
        trucks={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        pagination={{ total: 0, totalPages: 0, page: 1 }}
        onPageChange={vi.fn()}
      />
    );
    expect(screen.getByText('No hay registros de camiones')).toBeInTheDocument();
  });

  it('debe renderizar la cabecera de la tabla', () => {
    render(
      <TruckList
        trucks={mockTrucks}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        pagination={mockPagination}
        onPageChange={vi.fn()}
      />
    );
    expect(screen.getByText('Modelo')).toBeInTheDocument();
    expect(screen.getByText('Matricula')).toBeInTheDocument();
    expect(screen.getByText('Hora Llegada')).toBeInTheDocument();
    expect(screen.getByText('Carga')).toBeInTheDocument();
  });

  it('debe renderizar una fila por cada camion', () => {
    render(
      <TruckList
        trucks={mockTrucks}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        pagination={mockPagination}
        onPageChange={vi.fn()}
      />
    );

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
    render(
      <TruckList
        trucks={mockTrucks}
        onEdit={onEdit}
        onDelete={vi.fn()}
        pagination={mockPagination}
        onPageChange={vi.fn()}
      />
    );

    const editButtons = screen.getAllByText('Editar');
    await user.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledWith(mockTrucks[0]);
  });

  it('debe llamar onDelete con el id al hacer click en eliminar', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(
      <TruckList
        trucks={mockTrucks}
        onEdit={vi.fn()}
        onDelete={onDelete}
        pagination={mockPagination}
        onPageChange={vi.fn()}
      />
    );

    const deleteButtons = screen.getAllByText('Eliminar');
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('debe formatear la fecha de llegada', () => {
    render(
      <TruckList
        trucks={mockTrucks}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        pagination={mockPagination}
        onPageChange={vi.fn()}
      />
    );
    const cells = screen.getAllByRole('cell');
    const dateCell = cells.find((c) => c.textContent.includes('2024'));
    expect(dateCell).toBeInTheDocument();
  });

  it('debe mostrar paginacion cuando hay mas de una pagina', () => {
    render(
      <TruckList
        trucks={mockTrucks}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        pagination={{ total: 10, totalPages: 2, page: 1 }}
        onPageChange={vi.fn()}
      />
    );
    expect(screen.getByText('Siguiente')).toBeInTheDocument();
    expect(screen.getByText('Anterior')).toBeInTheDocument();
    expect(screen.getByText(/Pagina 1 de 2/)).toBeInTheDocument();
  });

  it('debe deshabilitar boton anterior en la primera pagina', () => {
    render(
      <TruckList
        trucks={mockTrucks}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        pagination={{ total: 10, totalPages: 2, page: 1 }}
        onPageChange={vi.fn()}
      />
    );
    expect(screen.getByText('Anterior')).toBeDisabled();
  });

  it('debe deshabilitar boton siguiente en la ultima pagina', () => {
    render(
      <TruckList
        trucks={mockTrucks}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        pagination={{ total: 10, totalPages: 2, page: 2 }}
        onPageChange={vi.fn()}
      />
    );
    expect(screen.getByText('Siguiente')).toBeDisabled();
  });

  it('debe llamar onPageChange al hacer click en siguiente', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TruckList
        trucks={mockTrucks}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        pagination={{ total: 10, totalPages: 2, page: 1 }}
        onPageChange={onPageChange}
      />
    );

    await user.click(screen.getByText('Siguiente'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('debe llamar onPageChange al hacer click en anterior', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TruckList
        trucks={mockTrucks}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        pagination={{ total: 10, totalPages: 2, page: 2 }}
        onPageChange={onPageChange}
      />
    );

    await user.click(screen.getByText('Anterior'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
