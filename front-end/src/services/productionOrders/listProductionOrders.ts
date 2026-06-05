import { adaptProductionOrder } from '@/services/adapters/adaptProductionOrder';
import { apiClient } from '@/services/http/apiClient';
import type { PaginatedProductionOrders } from '@/types/productionOrder';

interface ListProductionOrdersResponseDto {
  items: Parameters<typeof adaptProductionOrder>[0][];
  pagination: PaginatedProductionOrders['pagination'];
}

export async function listProductionOrders() {
  const response = await apiClient.get<ListProductionOrdersResponseDto>(
    '/production-orders',
  );

  return {
    items: response.data.items.map(adaptProductionOrder),
    pagination: response.data.pagination,
  } satisfies PaginatedProductionOrders;
}
