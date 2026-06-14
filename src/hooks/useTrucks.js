import { useState, useEffect, useCallback } from 'react';
import { getTrucks } from '../services/api';

export function useTrucks({ page = 1, limit = 10, search = '', dateFrom = '', dateTo = '' } = {}) {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchTrucks = async () => {
      try {
        const data = await getTrucks({ page, limit, search, dateFrom, dateTo });
        if (!cancelled) {
          setTrucks(data.data);
          setPagination({ total: data.total, totalPages: data.totalPages, page: data.page });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTrucks();
    return () => { cancelled = true; };
  }, [page, limit, search, dateFrom, dateTo, refreshKey]);

  const refresh = useCallback(() => {
    setLoading(true);
    setRefreshKey((prev) => prev + 1);
  }, []);

  return { trucks, loading, error, refresh, setError, pagination };
}
