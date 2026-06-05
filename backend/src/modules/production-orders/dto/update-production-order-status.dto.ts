import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { ProductionOrderStatus } from '../entities/production-order.entity';

export class UpdateProductionOrderStatusDto {
  @IsEnum(ProductionOrderStatus)
  status!: ProductionOrderStatus;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(500)
  notes?: string;
}
