import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('Users flow (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/users (POST)', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(httpServer)
      .post('/api/users')
      .send({
        name: 'Grace Hopper',
        email: 'grace@example.com',
        password: 'password123',
        role: 'member',
      })
      .expect(201);

    const body = response.body as { email: string; name: string };

    expect(body.email).toBe('grace@example.com');
    expect(body.name).toBe('Grace Hopper');
  });

  it('/api/app/versions/check (GET)', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(httpServer)
      .get('/api/app/versions/check')
      .set('x-app-platform', 'ios')
      .set('x-app-tracking-version', '0.9.0-20260101')
      .expect(200);

    const body = response.body as {
      appTrackingVersion: string;
      minimumSupportedVersion: string;
      updateRequired: boolean;
    };

    expect(body.appTrackingVersion).toBe('0.9.0-20260101');
    expect(body.minimumSupportedVersion).toBe('1.0.0-20260528');
    expect(body.updateRequired).toBe(true);
  });

  it('/api/production-orders lifecycle', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    await request(httpServer).post('/api/users').send({
      name: 'Production Planner',
      email: 'planner@example.com',
      password: 'password123',
      role: 'admin',
    });

    const signInResponse = await request(httpServer)
      .post('/api/auth/login')
      .send({
        email: 'planner@example.com',
        password: 'password123',
      })
      .expect(201);

    const accessToken = (signInResponse.body as { accessToken: string })
      .accessToken;

    const createResponse = await request(httpServer)
      .post('/api/production-orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        orderNumber: 'OP-2026-900',
        item: {
          productCode: 'PRD-900',
          productDescription: 'Perfil Estrutural',
          quantity: 15,
          unit: 'pc',
        },
      })
      .expect(201);

    const createdOrder = createResponse.body as {
      id: string;
      status: string;
      history: Array<{ eventType: string }>;
    };

    expect(createdOrder.status).toBe('backlog');
    expect(createdOrder.history[0]?.eventType).toBe('created');

    await request(httpServer)
      .get('/api/production-orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }: { body: { items: Array<{ id: string }> } }) => {
        expect(body.items.some((item) => item.id === createdOrder.id)).toBe(
          true,
        );
      });

    await request(httpServer)
      .patch(`/api/production-orders/${createdOrder.id}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: 'in_progress',
        notes: 'Separado para producao',
      })
      .expect(200)
      .expect(
        ({
          body,
        }: {
          body: { status: string; history: Array<{ eventType: string }> };
        }) => {
          expect(body.status).toBe('in_progress');
          expect(body.history.at(-1)?.eventType).toBe('status_changed');
        },
      );
  });

  it('/api/production-orders/imports/erp-flex (POST)', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    await request(httpServer).post('/api/users').send({
      name: 'ERP Operator',
      email: 'erp-operator@example.com',
      password: 'password123',
      role: 'admin',
    });

    const signInResponse = await request(httpServer)
      .post('/api/auth/login')
      .send({
        email: 'erp-operator@example.com',
        password: 'password123',
      })
      .expect(201);

    const accessToken = (signInResponse.body as { accessToken: string })
      .accessToken;

    const importResponse = await request(httpServer)
      .post('/api/production-orders/imports/erp-flex')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        externalOrderId: 'ERP-IMPORT-001',
        orderNumber: 'OP-ERP-001',
        item: {
          productCode: 'ERP-PRD-001',
          productDescription: 'Chapa Importada',
          quantity: 12,
          unit: 'pc',
        },
        sourcePageUrl: 'https://erp-flex.example.com/orders/ERP-IMPORT-001',
      })
      .expect(201);

    const imported = importResponse.body as {
      result: string;
      productionOrder: {
        id: string;
        origin: string;
        source: { externalOrderId: string | null };
      };
    };

    expect(imported.result).toBe('created');
    expect(imported.productionOrder.source.externalOrderId).toBe(
      'ERP-IMPORT-001',
    );

    await request(httpServer)
      .post('/api/production-orders/imports/erp-flex')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        externalOrderId: 'ERP-IMPORT-001',
        orderNumber: 'OP-ERP-002',
        item: {
          productCode: 'ERP-PRD-002',
          productDescription: 'Chapa Duplicada',
          quantity: 14,
          unit: 'pc',
        },
      })
      .expect(409)
      .expect(
        ({
          body,
        }: {
          body: {
            result: string;
            externalOrderId: string;
            existingProductionOrderId: string;
          };
        }) => {
          expect(body.result).toBe('duplicate');
          expect(body.externalOrderId).toBe('ERP-IMPORT-001');
          expect(body.existingProductionOrderId).toBe(
            imported.productionOrder.id,
          );
        },
      );
  });
});
