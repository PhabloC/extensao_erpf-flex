import { useCallback, useEffect, useState } from 'react';

import { getDashboardSummary } from '@/services/dashboard/getDashboardSummary';
import type { DashboardSummary } from '@/types/dashboard';

export function useDashboardSummary() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    setIsLoading(true);

    try {
      const summary = await getDashboardSummary();

      setData(summary);
      setError(null);
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : 'Failed to load dashboard data.';

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  return {
    data,
    isLoading,
    error,
    reload: loadSummary,
  };
}
