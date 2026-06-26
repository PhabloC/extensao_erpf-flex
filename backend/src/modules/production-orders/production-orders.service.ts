import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { formatISO } from 'date-fns';

import { type RequestUser } from '../../common/decorators/current-user.decorator';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { ImportProductionOrderFromErpFlexDto } from './dto/import-production-order-from-erp-flex.dto';
import { ListProductionOrdersQueryDto } from './dto/list-production-orders.dto';
import { UpdateProductionOrderStatusDto } from './dto/update-production-order-status.dto';
import {
  ProductionOrderHistoryEventType,
  ProductionOrderOrigin,
  ProductionOrderStatus,
  type ProductionOrderHistoryEvent,
} from './entities/production-order.entity';
import { ProductionOrdersRepository } from './production-orders.repository';

@Injectable()
export class ProductionOrdersService {
  constructor(
    private readonly productionOrdersRepository: ProductionOrdersRepository,
  ) {}

  async create(dto: CreateProductionOrderDto, user: RequestUser) {
    const existingOrder =
      await this.productionOrdersRepository.findByOrderNumber(dto.orderNumber);

    if (existingOrder) {
      throw new ConflictException(
        'A production order with this order number already exists.',
      );
    }

    return this.createRecord({
      orderNumber: dto.orderNumber,
      productCode: dto.item.productCode,
      productDescription: dto.item.productDescription,
      quantity: dto.item.quantity,
      unit: dto.item.unit,
      issueDate: dto.issueDate,
      dueDate: dto.dueDate,
      notes: dto.notes,
      origin: ProductionOrderOrigin.MANUAL,
      createdByUserId: user.userId,
      importedByUserId: undefined,
      externalOrderId: undefined,
      sourcePageUrl: undefined,
      importedAt: undefined,
      initialHistoryEventType: ProductionOrderHistoryEventType.CREATED,
      initialStatus: dto.status,
    });
  }

  async importFromErpFlex(
    dto: ImportProductionOrderFromErpFlexDto,
    user: RequestUser,
  ) {
    const existingOrderByExternalId =
      await this.productionOrdersRepository.findActiveByExternalOrderId(
        dto.externalOrderId,
      );

    if (existingOrderByExternalId) {
      const orderWithSameOrderNumber =
        await this.productionOrdersRepository.findByOrderNumber(dto.orderNumber);

      if (
        orderWithSameOrderNumber &&
        orderWithSameOrderNumber.id !== existingOrderByExternalId.id
      ) {
        throw new ConflictException(
          'A production order with this order number already exists.',
        );
      }

      if (!dto.existingProductionOrderId) {
        throw new ConflictException({
          code: 'ACTIVE_PRODUCTION_ORDER_EXISTS',
          message:
            'An active production order already exists for this ERP order.',
          result: 'duplicate',
          existingProductionOrderId: existingOrderByExternalId.id,
          externalOrderId: dto.externalOrderId,
        });
      }

      if (dto.existingProductionOrderId !== existingOrderByExternalId.id) {
        throw new ConflictException(
          'The provided existing production order id does not match the active ERP order.',
        );
      }

      const updatedOrder = await this.productionOrdersRepository.updateImportedOrder(
        existingOrderByExternalId.id,
        {
          orderNumber: dto.orderNumber,
          productCode: dto.item.productCode,
          productDescription: dto.item.productDescription,
          quantity: dto.item.quantity,
          unit: dto.item.unit,
          issueDate: dto.issueDate,
          dueDate: this.resolveImportDueDate(dto),
          notes: this.resolveImportNotes(dto),
          externalOrderId: dto.externalOrderId,
          sourcePageUrl: dto.sourcePageUrl,
          importedAt: new Date(),
          importedByUserId: user.userId,
          sourcePayloadSnapshot: dto.rawPayload,
          history: [
            ...existingOrderByExternalId.history,
            this.buildHistoryEvent({
              eventType: ProductionOrderHistoryEventType.UPDATED,
              fromStatus: existingOrderByExternalId.status,
              toStatus: existingOrderByExternalId.status,
              notes: this.buildImportUpdateHistoryNotes(dto),
              userId: user.userId,
            }),
          ],
        },
      );

      if (!updatedOrder) {
        throw new NotFoundException('Production order not found.');
      }

      return {
        result: 'updated' as const,
        productionOrder: updatedOrder,
      };
    }

    const existingOrderByOrderNumber =
      await this.productionOrdersRepository.findByOrderNumber(dto.orderNumber);

    if (existingOrderByOrderNumber) {
      throw new ConflictException(
        'A production order with this order number already exists.',
      );
    }

    const productionOrder = await this.createRecord({
      orderNumber: dto.orderNumber,
      productCode: dto.item.productCode,
      productDescription: dto.item.productDescription,
      quantity: dto.item.quantity,
      unit: dto.item.unit,
      issueDate: dto.issueDate,
      dueDate: this.resolveImportDueDate(dto),
      notes: this.resolveImportNotes(dto),
      origin: ProductionOrderOrigin.ERP_FLEX,
      createdByUserId: user.userId,
      importedByUserId: user.userId,
      externalOrderId: dto.externalOrderId,
      sourcePageUrl: dto.sourcePageUrl,
      importedAt: new Date(),
      sourcePayloadSnapshot: dto.rawPayload,
      initialHistoryEventType: ProductionOrderHistoryEventType.IMPORTED,
      initialHistoryNotes: this.buildImportHistoryNotes(dto),
      initialStatus: undefined,
    });

    return {
      result: 'created' as const,
      productionOrder,
    };
  }

  findAll(query: ListProductionOrdersQueryDto) {
    return this.productionOrdersRepository.findAll({
      status: query.status,
      origin: query.origin,
      search: query.search,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  async findOne(id: string) {
    const order = await this.productionOrdersRepository.findById(id);

    if (!order) {
      throw new NotFoundException('Production order not found.');
    }

    return order;
  }

  async updateStatus(
    id: string,
    dto: UpdateProductionOrderStatusDto,
    user: RequestUser,
  ) {
    const existingOrder = await this.findOne(id);

    if (existingOrder.status === dto.status) {
      throw new BadRequestException(
        'Production order is already in the requested status.',
      );
    }

    if (
      [ProductionOrderStatus.DONE, ProductionOrderStatus.CANCELED].includes(
        existingOrder.status,
      )
    ) {
      throw new BadRequestException(
        'Completed or canceled production orders cannot change status.',
      );
    }

    const updatedHistory = [
      ...existingOrder.history,
      this.buildHistoryEvent({
        eventType: ProductionOrderHistoryEventType.STATUS_CHANGED,
        fromStatus: existingOrder.status,
        toStatus: dto.status,
        notes: dto.notes ?? null,
        userId: user.userId,
      }),
    ];

    const updatedOrder = await this.productionOrdersRepository.updateStatus(
      id,
      {
        status: dto.status,
        history: updatedHistory,
      },
    );

    if (!updatedOrder) {
      throw new NotFoundException('Production order not found.');
    }

    return updatedOrder;
  }

  private buildHistoryEvent(input: {
    eventType: ProductionOrderHistoryEventType;
    fromStatus: ProductionOrderStatus | null;
    toStatus: ProductionOrderStatus | null;
    notes: string | null;
    userId: string | null;
  }): ProductionOrderHistoryEvent {
    return {
      id: randomUUID(),
      eventType: input.eventType,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      notes: input.notes,
      createdAt: formatISO(new Date()),
      createdByUserId: input.userId,
    };
  }

  private createRecord(input: {
    orderNumber: string;
    productCode: string;
    productDescription: string;
    quantity: number;
    unit?: string;
    issueDate?: string;
    dueDate?: string;
    notes?: string;
    origin: ProductionOrderOrigin;
    externalOrderId?: string;
    sourcePageUrl?: string;
    importedAt?: Date;
    importedByUserId?: string;
    createdByUserId?: string;
    sourcePayloadSnapshot?: Record<string, unknown>;
    initialHistoryEventType: ProductionOrderHistoryEventType;
    initialHistoryNotes?: string | null;
    initialStatus?: ProductionOrderStatus;
  }) {
    const status = input.initialStatus ?? ProductionOrderStatus.BACKLOG;
    const history = [
      this.buildHistoryEvent({
        eventType: input.initialHistoryEventType,
        fromStatus: null,
        toStatus: status,
        notes: input.initialHistoryNotes ?? null,
        userId: input.createdByUserId ?? null,
      }),
    ];

    return this.productionOrdersRepository.create({
      orderNumber: input.orderNumber,
      productCode: input.productCode,
      productDescription: input.productDescription,
      quantity: input.quantity,
      unit: input.unit,
      issueDate: input.issueDate,
      dueDate: input.dueDate,
      notes: input.notes,
      status,
      origin: input.origin,
      externalOrderId: input.externalOrderId,
      sourcePageUrl: input.sourcePageUrl,
      importedAt: input.importedAt,
      importedByUserId: input.importedByUserId,
      createdByUserId: input.createdByUserId,
      sourcePayloadSnapshot: input.sourcePayloadSnapshot,
      history,
    });
  }

  private buildImportHistoryNotes(
    dto: ImportProductionOrderFromErpFlexDto,
  ): string | null {
    const details: string[] = [`ERP external id: ${dto.externalOrderId}`];
    const extractionStrategy =
      dto.rawPayload?.['extractionStrategy'] ??
      (typeof dto.rawPayload?.['candidates'] === 'object'
        ? 'structured+dom'
        : null);
    const collectedAt = dto.rawPayload?.['collectedAt'];

    if (dto.sourcePageUrl) {
      details.push(`Source page: ${dto.sourcePageUrl}`);
    }

    if (typeof extractionStrategy === 'string' && extractionStrategy.trim()) {
      details.push(`Capture strategy: ${extractionStrategy.trim()}`);
    }

    if (typeof collectedAt === 'string' && collectedAt.trim()) {
      details.push(`Captured at: ${collectedAt.trim()}`);
    }

    return details.join(' | ');
  }

  private buildImportUpdateHistoryNotes(
    dto: ImportProductionOrderFromErpFlexDto,
  ): string | null {
    const baseNotes = this.buildImportHistoryNotes(dto);

    return baseNotes ? `ERP import updated | ${baseNotes}` : 'ERP import updated';
  }

  private resolveImportNotes(
    dto: ImportProductionOrderFromErpFlexDto,
  ): string | undefined {
    const normalizedNotes = dto.notes?.trim();

    if (normalizedNotes) {
      return normalizedNotes;
    }

    const normalizedComplementaryFields = dto.complementaryFields?.trim();

    return normalizedComplementaryFields || undefined;
  }

  private resolveImportDueDate(
    dto: ImportProductionOrderFromErpFlexDto,
  ): string | undefined {
    if (dto.dueDate) {
      return dto.dueDate;
    }

    const candidateDueDate = this.readRawPayloadCandidate(dto, 'dueDate');

    if (!candidateDueDate) {
      return undefined;
    }

    const normalizedCandidate = candidateDueDate.trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedCandidate)) {
      return normalizedCandidate;
    }

    const brDateMatch = normalizedCandidate.match(
      /^(\d{2})\/(\d{2})\/(\d{4})$/,
    );

    if (!brDateMatch) {
      return undefined;
    }

    const [, day, month, year] = brDateMatch;

    return `${year}-${month}-${day}`;
  }

  private readRawPayloadCandidate(
    dto: ImportProductionOrderFromErpFlexDto,
    field: string,
  ): string | null {
    const rawCandidates = dto.rawPayload?.['candidates'];

    if (!rawCandidates || typeof rawCandidates !== 'object') {
      return null;
    }

    const value = (rawCandidates as Record<string, unknown>)[field];

    return typeof value === 'string' ? value : null;
  }
}
