import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProductionOrderStatus {
  BACKLOG = 'backlog',
  READY = 'ready',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  DONE = 'done',
  CANCELED = 'canceled',
}

export enum ProductionOrderOrigin {
  MANUAL = 'manual',
  ERP_FLEX = 'erp-flex',
}

export enum ProductionOrderHistoryEventType {
  CREATED = 'created',
  IMPORTED = 'imported',
  STATUS_CHANGED = 'status_changed',
  UPDATED = 'updated',
}

export interface ProductionOrderHistoryEvent {
  id: string;
  eventType: ProductionOrderHistoryEventType;
  fromStatus: ProductionOrderStatus | null;
  toStatus: ProductionOrderStatus | null;
  notes: string | null;
  createdAt: string;
  createdByUserId: string | null;
}

@Entity({ name: 'production_orders' })
export class ProductionOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_production_orders_order_number', { unique: true })
  @Column({ name: 'order_number', type: 'varchar', length: 120, unique: true })
  orderNumber!: string;

  @Column({ name: 'product_code', type: 'varchar', length: 60 })
  productCode!: string;

  @Column({ name: 'product_description', type: 'varchar', length: 240 })
  productDescription!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  quantity!: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  unit!: string | null;

  @Column({ name: 'issue_date', type: 'date', nullable: true })
  issueDate!: string | null;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate!: string | null;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  notes!: string | null;

  @Column({
    type: 'enum',
    enum: ProductionOrderStatus,
    default: ProductionOrderStatus.BACKLOG,
  })
  status!: ProductionOrderStatus;

  @Column({
    type: 'enum',
    enum: ProductionOrderOrigin,
    default: ProductionOrderOrigin.MANUAL,
  })
  origin!: ProductionOrderOrigin;

  @Index('idx_production_orders_external_order_id', { unique: true })
  @Column({
    name: 'external_order_id',
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  externalOrderId!: string | null;

  @Column({
    name: 'source_page_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  sourcePageUrl!: string | null;

  @Column({ name: 'imported_at', type: 'timestamptz', nullable: true })
  importedAt!: Date | null;

  @Column({ name: 'imported_by_user_id', type: 'uuid', nullable: true })
  importedByUserId!: string | null;

  @Column({ name: 'created_by_user_id', type: 'uuid', nullable: true })
  createdByUserId!: string | null;

  @Column({
    name: 'source_payload_snapshot',
    type: 'jsonb',
    nullable: true,
  })
  sourcePayloadSnapshot!: Record<string, unknown> | null;

  @Column({
    type: 'jsonb',
    default: () => "'[]'",
  })
  history!: ProductionOrderHistoryEvent[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
