import {
  type ProductionOrderEntity,
  type ProductionOrderHistoryEvent,
} from './entities/production-order.entity';

export interface ProductionOrderResponse {
  id: string;
  orderNumber: string;
  item: {
    productCode: string;
    productDescription: string;
    quantity: number;
    unit: string | null;
  };
  dueDate: string | null;
  issueDate: string | null;
  notes: string | null;
  status: ProductionOrderEntity['status'];
  source: {
    origin: ProductionOrderEntity['origin'];
    externalOrderId: string | null;
    sourcePageUrl: string | null;
    importedAt: string | null;
    importedByUserId: string | null;
  };
  createdAt: string;
  createdByUserId: string | null;
  history: ProductionOrderHistoryEvent[];
}

export function presentProductionOrder(
  entity: ProductionOrderEntity,
): ProductionOrderResponse {
  return {
    id: entity.id,
    orderNumber: entity.orderNumber,
    item: {
      productCode: entity.productCode,
      productDescription: entity.productDescription,
      quantity: Number(entity.quantity),
      unit: entity.unit,
    },
    dueDate: entity.dueDate,
    issueDate: entity.issueDate,
    notes: entity.notes,
    status: entity.status,
    source: {
      origin: entity.origin,
      externalOrderId: entity.externalOrderId,
      sourcePageUrl: entity.sourcePageUrl,
      importedAt: entity.importedAt?.toISOString() ?? null,
      importedByUserId: entity.importedByUserId,
    },
    createdAt: entity.createdAt.toISOString(),
    createdByUserId: entity.createdByUserId,
    history: entity.history,
  };
}
