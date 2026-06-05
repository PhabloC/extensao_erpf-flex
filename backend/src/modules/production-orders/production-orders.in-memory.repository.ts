import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  type CreateProductionOrderRecordInput,
  type ListProductionOrdersFilters,
  type PaginatedProductionOrdersResult,
  ProductionOrdersRepository,
  type UpdateProductionOrderStatusRecordInput,
} from './production-orders.repository';
import { type ProductionOrderEntity } from './entities/production-order.entity';

@Injectable()
export class InMemoryProductionOrdersRepository extends ProductionOrdersRepository {
  private readonly orders = new Map<string, ProductionOrderEntity>();

  create(input: CreateProductionOrderRecordInput) {
    const now = new Date();
    const order: ProductionOrderEntity = {
      id: randomUUID(),
      orderNumber: input.orderNumber,
      productCode: input.productCode,
      productDescription: input.productDescription,
      quantity: input.quantity,
      unit: input.unit ?? null,
      issueDate: input.issueDate ?? null,
      dueDate: input.dueDate ?? null,
      notes: input.notes ?? null,
      status: input.status,
      origin: input.origin,
      externalOrderId: input.externalOrderId ?? null,
      sourcePageUrl: input.sourcePageUrl ?? null,
      importedAt: input.importedAt ?? null,
      importedByUserId: input.importedByUserId ?? null,
      createdByUserId: input.createdByUserId ?? null,
      sourcePayloadSnapshot: input.sourcePayloadSnapshot ?? null,
      history: input.history.map((event) => ({ ...event })),
      createdAt: now,
      updatedAt: now,
    };

    this.orders.set(order.id, order);

    return Promise.resolve(this.cloneOrder(order));
  }

  findAll(filters: ListProductionOrdersFilters) {
    let items = Array.from(this.orders.values());

    if (filters.status) {
      items = items.filter((order) => order.status === filters.status);
    }

    if (filters.origin) {
      items = items.filter((order) => order.origin === filters.origin);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();

      items = items.filter((order) =>
        [order.orderNumber, order.productCode, order.productDescription]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(search)),
      );
    }

    items.sort(
      (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
    );

    const totalItems = items.length;
    const totalPages =
      totalItems === 0 ? 0 : Math.ceil(totalItems / filters.pageSize);
    const start = (filters.page - 1) * filters.pageSize;
    const paginatedItems = items
      .slice(start, start + filters.pageSize)
      .map((order) => this.cloneOrder(order));

    const result: PaginatedProductionOrdersResult = {
      items: paginatedItems,
      totalItems,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages,
    };

    return Promise.resolve(result);
  }

  findById(id: string) {
    const order = this.orders.get(id);

    return Promise.resolve(order ? this.cloneOrder(order) : null);
  }

  findByOrderNumber(orderNumber: string) {
    const order = Array.from(this.orders.values()).find(
      (entry) => entry.orderNumber === orderNumber,
    );

    return Promise.resolve(order ? this.cloneOrder(order) : null);
  }

  findByExternalOrderId(externalOrderId: string) {
    const order = Array.from(this.orders.values()).find(
      (entry) => entry.externalOrderId === externalOrderId,
    );

    return Promise.resolve(order ? this.cloneOrder(order) : null);
  }

  updateStatus(id: string, input: UpdateProductionOrderStatusRecordInput) {
    const existingOrder = this.orders.get(id);

    if (!existingOrder) {
      return Promise.resolve(null);
    }

    const updatedOrder: ProductionOrderEntity = {
      ...existingOrder,
      status: input.status,
      history: input.history.map((event) => ({ ...event })),
      updatedAt: new Date(),
    };

    this.orders.set(id, updatedOrder);

    return Promise.resolve(this.cloneOrder(updatedOrder));
  }

  private cloneOrder(order: ProductionOrderEntity): ProductionOrderEntity {
    return {
      ...order,
      importedAt: order.importedAt ? new Date(order.importedAt) : null,
      sourcePayloadSnapshot: order.sourcePayloadSnapshot
        ? structuredClone(order.sourcePayloadSnapshot)
        : null,
      history: order.history.map((event) => ({ ...event })),
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
    };
  }
}
