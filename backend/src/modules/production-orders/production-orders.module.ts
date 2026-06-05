import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductionOrdersController } from './production-orders.controller';
import { ProductionOrderEntity } from './entities/production-order.entity';
import { InMemoryProductionOrdersRepository } from './production-orders.in-memory.repository';
import { ProductionOrdersRepository } from './production-orders.repository';
import { ProductionOrdersService } from './production-orders.service';
import { TypeOrmProductionOrdersRepository } from './production-orders.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionOrderEntity])],
  controllers: [ProductionOrdersController],
  providers: [
    ProductionOrdersService,
    InMemoryProductionOrdersRepository,
    TypeOrmProductionOrdersRepository,
    {
      provide: ProductionOrdersRepository,
      inject: [
        ConfigService,
        InMemoryProductionOrdersRepository,
        TypeOrmProductionOrdersRepository,
      ],
      useFactory: (
        configService: ConfigService,
        inMemoryRepository: InMemoryProductionOrdersRepository,
        typeOrmRepository: TypeOrmProductionOrdersRepository,
      ) => {
        const isDatabaseEnabled =
          configService.get<boolean>('database.enabled') ?? false;

        return isDatabaseEnabled ? typeOrmRepository : inMemoryRepository;
      },
    },
  ],
  exports: [ProductionOrdersService],
})
export class ProductionOrdersModule {}
