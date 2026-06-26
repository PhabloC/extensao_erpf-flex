import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import {
  type CreateProductionOrderRecordInput,
  type ListProductionOrdersFilters,
  type PaginatedProductionOrdersResult,
  ProductionOrdersRepository,
  type UpdateImportedProductionOrderRecordInput,
  type UpdateProductionOrderStatusRecordInput,
} from './production-orders.repository';
import {
  ProductionOrderEntity,
  ProductionOrderStatus,
} from './entities/production-order.entity';

@Injectable()
export class TypeOrmProductionOrdersRepository extends ProductionOrdersRepository {
  constructor(
    @InjectRepository(ProductionOrderEntity)
    private readonly repository: Repository<ProductionOrderEntity>,
  ) {
    super();
  }

  async create(input: CreateProductionOrderRecordInput) {
    const order = this.repository.create({
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
      history: input.history,
    });

    return this.repository.save(order);
  }

  async findAll(filters: ListProductionOrdersFilters) {
    const queryBuilder = this.repository.createQueryBuilder('order');

    if (filters.status) {
      queryBuilder.andWhere('order.status = :status', {
        status: filters.status,
      });
    }

    if (filters.origin) {
      queryBuilder.andWhere('order.origin = :origin', {
        origin: filters.origin,
      });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('order.orderNumber ILIKE :search', {
            search: `%${filters.search}%`,
          })
            .orWhere('order.productCode ILIKE :search', {
              search: `%${filters.search}%`,
            })
            .orWhere('order.productDescription ILIKE :search', {
              search: `%${filters.search}%`,
            });
        }),
      );
    }

    queryBuilder
      .orderBy('order.createdAt', 'DESC')
      .skip((filters.page - 1) * filters.pageSize)
      .take(filters.pageSize);

    const [items, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages =
      totalItems === 0 ? 0 : Math.ceil(totalItems / filters.pageSize);

    const result: PaginatedProductionOrdersResult = {
      items,
      totalItems,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages,
    };

    return result;
  }

  findById(id: string) {
    return this.repository.findOne({
      where: { id },
    });
  }

  findByOrderNumber(orderNumber: string) {
    return this.repository.findOne({
      where: { orderNumber },
    });
  }

  findActiveByExternalOrderId(externalOrderId: string) {
    return this.repository
      .createQueryBuilder('order')
      .where('order.externalOrderId = :externalOrderId', { externalOrderId })
      .andWhere('order.status NOT IN (:...closedStatuses)', {
        closedStatuses: [
          ProductionOrderStatus.DONE,
          ProductionOrderStatus.CANCELED,
        ],
      })
      .orderBy('order.createdAt', 'DESC')
      .getOne();
  }

  async updateStatus(
    id: string,
    input: UpdateProductionOrderStatusRecordInput,
  ) {
    const existingOrder = await this.findById(id);

    if (!existingOrder) {
      return null;
    }

    await this.repository.update(id, {
      status: input.status,
      history: input.history,
    });

    return this.findById(id);
  }

  async updateImportedOrder(
    id: string,
    input: UpdateImportedProductionOrderRecordInput,
  ) {
    const existingOrder = await this.findById(id);

    if (!existingOrder) {
      return null;
    }

    await this.repository.update(id, {
      orderNumber: input.orderNumber,
      productCode: input.productCode,
      productDescription: input.productDescription,
      quantity: input.quantity,
      unit: input.unit ?? null,
      issueDate: input.issueDate ?? null,
      dueDate: input.dueDate ?? null,
      notes: input.notes ?? null,
      externalOrderId: input.externalOrderId ?? null,
      sourcePageUrl: input.sourcePageUrl ?? null,
      importedAt: input.importedAt ?? null,
      importedByUserId: input.importedByUserId ?? null,
      sourcePayloadSnapshot: input.sourcePayloadSnapshot ?? null,
      history: input.history,
    });

    return this.findById(id);
  }
}
