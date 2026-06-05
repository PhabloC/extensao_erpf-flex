import type { AxiosError } from 'axios';

import { createApiClient } from '@/patterns/factory/createApiClient';
import { useAuthStore } from '@/stores/authStore';

const rawApiBaseUrl: unknown = import.meta.env['VITE_API_BASE_URL'];
const apiBaseUrl =
  typeof rawApiBaseUrl === 'string' ? rawApiBaseUrl : 'http://localhost:3000/api';

export const apiClient = createApiClient({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const normalizedMessage =
      error.response?.data?.message ?? error.message ?? 'Unexpected API error.';

    return Promise.reject(new Error(normalizedMessage));
  },
);
