export type ProductionOrderStatus =
  | 'backlog'
  | 'ready'
  | 'in_progress'
  | 'paused'
  | 'done'
  | 'canceled';

export type ProductionOrderOrigin = 'manual' | 'erp-flex';

export interface ProductionOrderHistoryEvent {
  id: string;
  eventType: 'created' | 'imported' | 'status_changed' | 'updated';
  fromStatus: ProductionOrderStatus | null;
  toStatus: ProductionOrderStatus | null;
  notes: string | null;
  createdAt: string;
  createdByUserId: string | null;
}

export interface ProductionOrderItem {
  productCode: string;
  productDescription: string;
  quantity: number;
  unit: string | null;
}

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  item: ProductionOrderItem;
  issueDate: string | null;
  dueDate: string | null;
  notes: string | null;
  status: ProductionOrderStatus;
  source: {
    origin: ProductionOrderOrigin;
    externalOrderId: string | null;
    sourcePageUrl: string | null;
    importedAt: string | null;
    importedByUserId: string | null;
  };
  createdAt: string;
  createdByUserId: string | null;
  history: ProductionOrderHistoryEvent[];
}

export interface PaginatedProductionOrders {
  items: ProductionOrder[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
