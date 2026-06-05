import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios';

export interface ApiClientFactoryOptions extends CreateAxiosDefaults {
  timeout?: number;
}

export function createApiClient(options: ApiClientFactoryOptions): AxiosInstance {
  return axios.create({
    timeout: 10000,
    ...options,
  });
}
