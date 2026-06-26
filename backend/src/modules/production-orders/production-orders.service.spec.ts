import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { type RequestUser } from '../../common/decorators/current-user.decorator';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { UpdateProductionOrderStatusDto } from './dto/update-production-order-status.dto';
import { InMemoryProductionOrdersRepository } from './production-orders.in-memory.repository';
import { ProductionOrderStatus } from './entities/production-order.entity';
import { ProductionOrdersService } from './production-orders.service';

describe('ProductionOrdersService', () => {
  let productionOrdersService: ProductionOrdersService;

  const user: RequestUser = {
    userId: '0d7437db-4618-464c-bec6-5cf17dbca736',
    email: 'pcp@example.com',
    role: 'admin',
    name: 'PCP',
  };

  beforeEach(() => {
    productionOrdersService = new ProductionOrdersService(
      new InMemoryProductionOrdersRepository(),
    );
  });

  it('creates a manual production order with default backlog status and history', async () => {
    const dto: CreateProductionOrderDto = {
      orderNumber: 'OP-2026-001',
      item: {
        productCode: 'PRD-001',
        productDescription: 'Bobina de Aco',
        quantity: 120,
        unit: 'kg',
      },
    };

    const order = await productionOrdersService.create(dto, user);

    expect(order.origin).toBe('manual');
    expect(order.status).toBe(ProductionOrderStatus.BACKLOG);
    expect(order.history).toHaveLength(1);
    expect(order.history[0]?.eventType).toBe('created');
  });

  it('rejects duplicate order numbers', async () => {
    const dto: CreateProductionOrderDto = {
      orderNumber: 'OP-2026-001',
      item: {
        productCode: 'PRD-001',
        productDescription: 'Bobina de Aco',
        quantity: 120,
      },
    };

    await productionOrdersService.create(dto, user);

    await expect(
      productionOrdersService.create(dto, user),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('imports an ERP Flex production order with traceability fields', async () => {
    const imported = await productionOrdersService.importFromErpFlex(
      {
        externalOrderId: 'ERP-OP-20458',
        orderNumber: 'OP-ERP-20458',
        customerName: 'Cliente Exemplo',
        variations: 'Azul Guanabara C/Abas',
        complementaryFields: 'SILK FRENTE, COSTURA REFORCADA',
        item: {
          productCode: 'ERP-001',
          productDescription: 'Bobina Importada',
          quantity: 22,
          unit: 'kg',
        },
        sourcePageUrl: 'https://erp-flex.example.com/orders/20458',
        rawPayload: {
          extractionStrategy: 'structured+dom',
          collectedAt: '2026-06-05T13:15:00.000Z',
          candidates: {
            dueDate: '30/06/2026',
          },
        },
      },
      user,
    );

    expect(imported.result).toBe('created');
    expect(imported.productionOrder.origin).toBe('erp-flex');
    expect(imported.productionOrder.externalOrderId).toBe('ERP-OP-20458');
    expect(imported.productionOrder.dueDate).toBe('2026-06-30');
    expect(imported.productionOrder.notes).toBe('SILK FRENTE, COSTURA REFORCADA');
    expect(imported.productionOrder.history[0]?.eventType).toBe('imported');
    expect(imported.productionOrder.history[0]?.notes).toContain(
      'ERP external id: ERP-OP-20458',
    );
    expect(imported.productionOrder.sourcePayloadSnapshot).toEqual({
      extractionStrategy: 'structured+dom',
      collectedAt: '2026-06-05T13:15:00.000Z',
      candidates: {
        dueDate: '30/06/2026',
      },
    });
  });

  it('blocks active ERP imports until the operator confirms the existing order id', async () => {
    const imported = await productionOrdersService.importFromErpFlex(
      {
        externalOrderId: 'ERP-OP-20459',
        orderNumber: 'OP-ERP-20459',
        item: {
          productCode: 'ERP-002',
          productDescription: 'Perfil Importado',
          quantity: 8,
        },
      },
      user,
    );

    await expect(
      productionOrdersService.importFromErpFlex(
        {
          externalOrderId: 'ERP-OP-20459',
          orderNumber: 'OP-ERP-20460',
          item: {
            productCode: 'ERP-003',
            productDescription: 'Perfil Atualizado',
            quantity: 10,
          },
        },
        user,
      ),
    ).rejects.toBeInstanceOf(ConflictException);

    const updated = await productionOrdersService.importFromErpFlex(
      {
        externalOrderId: 'ERP-OP-20459',
        orderNumber: 'OP-ERP-20460',
        existingProductionOrderId: imported.productionOrder.id,
        item: {
          productCode: 'ERP-003',
          productDescription: 'Perfil Atualizado',
          quantity: 10,
        },
      },
      user,
    );

    expect(updated.result).toBe('updated');
    expect(updated.productionOrder.id).toBe(imported.productionOrder.id);
    expect(updated.productionOrder.orderNumber).toBe('OP-ERP-20460');
  });

  it('updates an active ERP import only when existingProductionOrderId is confirmed', async () => {
    const imported = await productionOrdersService.importFromErpFlex(
      {
        externalOrderId: 'ERP-OP-20463',
        orderNumber: 'OP-ERP-20463',
        item: {
          productCode: 'ERP-006',
          productDescription: 'Perfil Original',
          quantity: 3,
          unit: 'pc',
        },
      },
      user,
    );

    await expect(
      productionOrdersService.importFromErpFlex(
        {
          externalOrderId: 'ERP-OP-20463',
          orderNumber: 'OP-ERP-20463-ATUALIZADA',
          item: {
            productCode: 'ERP-006-A',
            productDescription: 'Perfil Atualizado',
            quantity: 11,
            unit: 'kg',
          },
          notes: 'Atualizado pela extensão',
        },
        user,
      ),
    ).rejects.toBeInstanceOf(ConflictException);

    const updated = await productionOrdersService.importFromErpFlex(
      {
        externalOrderId: 'ERP-OP-20463',
        orderNumber: 'OP-ERP-20463-ATUALIZADA',
        existingProductionOrderId: imported.productionOrder.id,
        item: {
          productCode: 'ERP-006-A',
          productDescription: 'Perfil Atualizado',
          quantity: 11,
          unit: 'kg',
        },
        notes: 'Atualizado pela extensão',
      },
      user,
    );

    expect(updated.result).toBe('updated');
    expect(updated.productionOrder.id).toBe(imported.productionOrder.id);
    expect(updated.productionOrder.orderNumber).toBe('OP-ERP-20463-ATUALIZADA');
    expect(updated.productionOrder.productCode).toBe('ERP-006-A');
    expect(updated.productionOrder.history.at(-1)?.eventType).toBe('updated');
  });

  it('allows reimporting the same externalOrderId after the previous order is done', async () => {
    const imported = await productionOrdersService.importFromErpFlex(
      {
        externalOrderId: 'ERP-OP-20461',
        orderNumber: 'OP-ERP-20461',
        item: {
          productCode: 'ERP-004',
          productDescription: 'Perfil Encerrado',
          quantity: 5,
        },
      },
      user,
    );

    await productionOrdersService.updateStatus(
      imported.productionOrder.id,
      { status: ProductionOrderStatus.DONE },
      user,
    );

    const reimported = await productionOrdersService.importFromErpFlex(
      {
        externalOrderId: 'ERP-OP-20461',
        orderNumber: 'OP-ERP-20462',
        item: {
          productCode: 'ERP-005',
          productDescription: 'Perfil Reimportado',
          quantity: 7,
        },
      },
      user,
    );

    expect(reimported.result).toBe('created');
    expect(reimported.productionOrder.orderNumber).toBe('OP-ERP-20462');
    expect(reimported.productionOrder.externalOrderId).toBe('ERP-OP-20461');
  });

  it('updates status and records history', async () => {
    const order = await productionOrdersService.create(
      {
        orderNumber: 'OP-2026-002',
        item: {
          productCode: 'PRD-002',
          productDescription: 'Perfil Metalico',
          quantity: 10,
        },
      },
      user,
    );

    const dto: UpdateProductionOrderStatusDto = {
      status: ProductionOrderStatus.IN_PROGRESS,
      notes: 'Liberado para producao',
    };

    const updatedOrder = await productionOrdersService.updateStatus(
      order.id,
      dto,
      user,
    );

    expect(updatedOrder.status).toBe(ProductionOrderStatus.IN_PROGRESS);
    expect(updatedOrder.history).toHaveLength(2);
    expect(updatedOrder.history[1]?.eventType).toBe('status_changed');
  });

  it('rejects status changes for unknown orders', async () => {
    await expect(
      productionOrdersService.updateStatus(
        '6b3efd66-eed1-45ea-90af-4d1b1c980ff7',
        { status: ProductionOrderStatus.READY },
        user,
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects status changes when the status is the same', async () => {
    const order = await productionOrdersService.create(
      {
        orderNumber: 'OP-2026-003',
        item: {
          productCode: 'PRD-003',
          productDescription: 'Chapa Galvanizada',
          quantity: 8,
        },
      },
      user,
    );

    await expect(
      productionOrdersService.updateStatus(
        order.id,
        { status: ProductionOrderStatus.BACKLOG },
        user,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
