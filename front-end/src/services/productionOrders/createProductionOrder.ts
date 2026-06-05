import { adaptProductionOrder } from '@/services/adapters/adaptProductionOrder';
import { apiClient } from '@/services/http/apiClient';
import type { ProductionOrder } from '@/types/productionOrder';

export interface CreateProductionOrderInput {
  orderNumber: string;
  item: {
    productCode: string;
    productDescription: string;
    quantity: number;
    unit?: string;
  };
  issueDate?: string;
  dueDate?: string;
  notes?: string;
}

export async function createProductionOrder(input: CreateProductionOrderInput) {
  const response = await apiClient.post<Parameters<typeof adaptProductionOrder>[0]>(
    '/production-orders',
    input,
  );

  return adaptProductionOrder(response.data) satisfies ProductionOrder;
}
