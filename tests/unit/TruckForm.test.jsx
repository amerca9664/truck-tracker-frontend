import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TruckForm from '../../src/components/TruckForm';

describe('TruckForm', () => {
  it('debe renderizar todos los campos del formulario', () => {
    render(<TruckForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/modelo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/matricula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hora de llegada/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/carga contenida/i)).toBeInTheDocument();
  });

  it('debe mostrar el titulo correcto al registrar', () => {
    render(<TruckForm onSubmit={vi.fn()} />);
    expect(screen.getByText('Registrar Llegada')).toBeInTheDocument();
  });

  it('debe mostrar el titulo correcto al editar', () => {
    const initial = { modelo: 'Volvo', matricula: 'ABC-123', hora_llegada: '2024-01-15T10:30', carga_contenida: 'Ropa' };
    render(<TruckForm onSubmit={vi.fn()} initialData={initial} />);
    expect(screen.getByText('Editar Camion')).toBeInTheDocument();
  });

  it('debe mostrar el boton cancelar cuando se pasa onCancel', () => {
    render(<TruckForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('debe llamar onSubmit con los datos al enviar el formulario', async () => {
    const onSubmit = vi.fn().mockResolvedValue();
    const user = userEvent.setup();
    render(<TruckForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/modelo/i), 'Volvo FH16');
    await user.type(screen.getByLabelText(/matricula/i), 'ABC-1234');
    await user.type(screen.getByLabelText(/carga contenida/i), 'Electrodomesticos');

    fireEvent.click(screen.getByText('Registrar'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    const callArg = onSubmit.mock.calls[0][0];
    expect(callArg.modelo).toBe('Volvo FH16');
    expect(callArg.matricula).toBe('ABC-1234');
    expect(callArg.carga_contenida).toBe('Electrodomesticos');
    expect(callArg.hora_llegada).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('debe llamar onCancel al hacer click en cancelar', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<TruckForm onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByText('Cancelar'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('debe prellenar los campos con initialData', () => {
    const initial = {
      modelo: 'Volvo',
      matricula: 'ABC-123',
      hora_llegada: '2024-01-15T10:30',
      carga_contenida: 'Ropa',
    };
    render(<TruckForm onSubmit={vi.fn()} initialData={initial} />);

    expect(screen.getByLabelText(/modelo/i).value).toBe('Volvo');
    expect(screen.getByLabelText(/matricula/i).value).toBe('ABC-123');
    expect(screen.getByLabelText(/hora de llegada/i).value).toBe('2024-01-15T10:30');
    expect(screen.getByLabelText(/carga contenida/i).value).toBe('Ropa');
  });

  it('debe deshabilitar el boton mientras se envia', async () => {
    let resolveSubmit;
    const onSubmit = vi.fn().mockReturnValue(new Promise((r) => { resolveSubmit = r; }));
    const user = userEvent.setup();
    render(<TruckForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/modelo/i), 'Volvo');
    await user.type(screen.getByLabelText(/matricula/i), 'ABC-123');
    await user.type(screen.getByLabelText(/carga contenida/i), 'Ropa');

    const submitBtn = screen.getByText('Registrar');
    fireEvent.click(submitBtn);

    expect(submitBtn.textContent).toBe('Guardando...');
    expect(submitBtn).toBeDisabled();

    resolveSubmit();
    await waitFor(() => {
      expect(screen.getByText('Registrar')).not.toBeDisabled();
    });
  });
});
