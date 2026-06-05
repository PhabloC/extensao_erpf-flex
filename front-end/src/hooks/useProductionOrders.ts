import { useCallback, useEffect, useState } from 'react';

import { createProductionOrder, type CreateProductionOrderInput } from '@/services/productionOrders/createProductionOrder';
import { listProductionOrders } from '@/services/productionOrders/listProductionOrders';
import { updateProductionOrderStatus } from '@/services/productionOrders/updateProductionOrderStatus';
import type { ProductionOrder, ProductionOrderStatus } from '@/types/productionOrder';

export function useProductionOrders(isEnabled: boolean) {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!isEnabled) {
      setOrders([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await listProductionOrders();

      setOrders(response.items);
      setError(null);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Failed to load production orders.';

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isEnabled]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const createOrder = useCallback(
    async (input: CreateProductionOrderInput) => {
      setIsSubmitting(true);

      try {
        const createdOrder = await createProductionOrder(input);

        setOrders((currentOrders) => [createdOrder, ...currentOrders]);
        setError(null);

        return createdOrder;
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : 'Failed to create production order.';

        setError(message);
        throw requestError;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const moveOrder = useCallback(
    async (orderId: string, status: ProductionOrderStatus) => {
      setIsUpdatingStatus(orderId);

      try {
        const updatedOrder = await updateProductionOrderStatus({ orderId, status });

        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order,
          ),
        );
        setError(null);

        return updatedOrder;
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : 'Failed to update production order status.';

        setError(message);
        throw requestError;
      } finally {
        setIsUpdatingStatus(null);
      }
    },
    [],
  );

  return {
    orders,
    isLoading,
    isSubmitting,
    isUpdatingStatus,
    error,
    reload: loadOrders,
    createOrder,
    moveOrder,
  };
}
