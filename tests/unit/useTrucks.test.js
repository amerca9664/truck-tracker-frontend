import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTrucks } from '../../src/hooks/useTrucks';
import { getTrucks } from '../../src/services/api';

vi.mock('../../src/services/api');

describe('useTrucks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe inicializar con loading=true y array vacio', () => {
    getTrucks.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useTrucks());
    expect(result.current.loading).toBe(true);
    expect(result.current.trucks).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('debe cargar los camiones al montarse', async () => {
    const trucks = [{ _id: '1', modelo: 'Volvo', matricula: 'ABC-123' }];
    getTrucks.mockResolvedValue({ data: trucks });

    const { result } = renderHook(() => useTrucks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.trucks).toEqual(trucks);
    expect(result.current.error).toBe(null);
  });

  it('debe capturar el error si la peticion falla', async () => {
    getTrucks.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTrucks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
  });

  it('debe refrescar la lista cuando se llama refresh()', async () => {
    getTrucks
      .mockResolvedValueOnce({ data: [{ _id: '1' }] })
      .mockResolvedValueOnce({ data: [{ _id: '1' }, { _id: '2' }] });

    const { result } = renderHook(() => useTrucks());

    await waitFor(() => {
      expect(result.current.trucks).toHaveLength(1);
    });

    act(() => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.trucks).toHaveLength(2);
    });
  });

  it('debe permitir actualizar el error manualmente', async () => {
    getTrucks.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useTrucks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setError('nuevo error');
    });

    expect(result.current.error).toBe('nuevo error');
  });
});
