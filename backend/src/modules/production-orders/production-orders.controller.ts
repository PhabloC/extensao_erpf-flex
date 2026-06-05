import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  CurrentUser,
  type RequestUser,
} from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { ImportProductionOrderFromErpFlexDto } from './dto/import-production-order-from-erp-flex.dto';
import { ListProductionOrdersQueryDto } from './dto/list-production-orders.dto';
import { UpdateProductionOrderStatusDto } from './dto/update-production-order-status.dto';
import { presentProductionOrder } from './production-orders.presenter';
import { ProductionOrdersService } from './production-orders.service';

@UseGuards(JwtAuthGuard)
@Controller('production-orders')
export class ProductionOrdersController {
  constructor(
    private readonly productionOrdersService: ProductionOrdersService,
  ) {}

  @Get()
  async findAll(@Query() query: ListProductionOrdersQueryDto) {
    const response = await this.productionOrdersService.findAll(query);

    return {
      items: response.items.map(presentProductionOrder),
      pagination: {
        page: response.page,
        pageSize: response.pageSize,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
      },
    };
  }

  @Post()
  async create(
    @Body() dto: CreateProductionOrderDto,
    @CurrentUser() user: RequestUser,
  ) {
    const order = await this.productionOrdersService.create(dto, user);

    return presentProductionOrder(order);
  }

  @Post('imports/erp-flex')
  async importFromErpFlex(
    @Body() dto: ImportProductionOrderFromErpFlexDto,
    @CurrentUser() user: RequestUser,
  ) {
    const result = await this.productionOrdersService.importFromErpFlex(
      dto,
      user,
    );

    return {
      result: result.result,
      productionOrder: presentProductionOrder(result.productionOrder),
    };
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const order = await this.productionOrdersService.findOne(id);

    return presentProductionOrder(order);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProductionOrderStatusDto,
    @CurrentUser() user: RequestUser,
  ) {
    const order = await this.productionOrdersService.updateStatus(
      id,
      dto,
      user,
    );

    return presentProductionOrder(order);
  }
}
