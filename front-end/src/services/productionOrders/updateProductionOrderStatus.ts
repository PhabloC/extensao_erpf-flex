import { adaptProductionOrder } from '@/services/adapters/adaptProductionOrder';
import { apiClient } from '@/services/http/apiClient';
import type { ProductionOrder, ProductionOrderStatus } from '@/types/productionOrder';

export async function updateProductionOrderStatus(input: {
  orderId: string;
  status: ProductionOrderStatus;
  notes?: string;
}) {
  const response = await apiClient.patch<Parameters<typeof adaptProductionOrder>[0]>(
    `/production-orders/${input.orderId}/status`,
    {
      status: input.status,
      notes: input.notes,
    },
  );

  return adaptProductionOrder(response.data) satisfies ProductionOrder;
}
