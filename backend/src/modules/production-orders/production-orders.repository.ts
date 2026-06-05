import {
  type ProductionOrderEntity,
  type ProductionOrderHistoryEvent,
  type ProductionOrderOrigin,
  type ProductionOrderStatus,
} from './entities/production-order.entity';

export interface CreateProductionOrderRecordInput {
  orderNumber: string;
  productCode: string;
  productDescription: string;
  quantity: number;
  unit?: string;
  issueDate?: string;
  dueDate?: string;
  notes?: string;
  status: ProductionOrderStatus;
  origin: ProductionOrderOrigin;
  externalOrderId?: string;
  sourcePageUrl?: string;
  importedAt?: Date;
  importedByUserId?: string;
  createdByUserId?: string;
  sourcePayloadSnapshot?: Record<string, unknown>;
  history: ProductionOrderHistoryEvent[];
}

export interface ListProductionOrdersFilters {
  status?: ProductionOrderStatus;
  origin?: ProductionOrderOrigin;
  search?: string;
  page: number;
  pageSize: number;
}

export interface UpdateProductionOrderStatusRecordInput {
  status: ProductionOrderStatus;
  history: ProductionOrderHistoryEvent[];
}

export interface PaginatedProductionOrdersResult {
  items: ProductionOrderEntity[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export abstract class ProductionOrdersRepository {
  abstract create(
    input: CreateProductionOrderRecordInput,
  ): Promise<ProductionOrderEntity>;

  abstract findAll(
    filters: ListProductionOrdersFilters,
  ): Promise<PaginatedProductionOrdersResult>;

  abstract findById(id: string): Promise<ProductionOrderEntity | null>;

  abstract findByOrderNumber(
    orderNumber: string,
  ): Promise<ProductionOrderEntity | null>;

  abstract findByExternalOrderId(
    externalOrderId: string,
  ): Promise<ProductionOrderEntity | null>;

  abstract updateStatus(
    id: string,
    input: UpdateProductionOrderStatusRecordInput,
  ): Promise<ProductionOrderEntity | null>;
}
