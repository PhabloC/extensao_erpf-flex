import type { ProductionOrder } from '@/types/productionOrder';

interface ProductionOrderDto {
  id: string;
  orderNumber: string;
  item: {
    productCode: string;
    productDescription: string;
    quantity: number;
    unit: string | null;
  };
  issueDate: string | null;
  dueDate: string | null;
  notes: string | null;
  status: ProductionOrder['status'];
  source: ProductionOrder['source'];
  createdAt: string;
  createdByUserId: string | null;
  history: ProductionOrder['history'];
}

export function adaptProductionOrder(dto: ProductionOrderDto): ProductionOrder {
  return {
    id: dto.id,
    orderNumber: dto.orderNumber,
    item: {
      productCode: dto.item.productCode,
      productDescription: dto.item.productDescription,
      quantity: dto.item.quantity,
      unit: dto.item.unit,
    },
    issueDate: dto.issueDate,
    dueDate: dto.dueDate,
    notes: dto.notes,
    status: dto.status,
    source: dto.source,
    createdAt: dto.createdAt,
    createdByUserId: dto.createdByUserId,
    history: dto.history,
  };
}
