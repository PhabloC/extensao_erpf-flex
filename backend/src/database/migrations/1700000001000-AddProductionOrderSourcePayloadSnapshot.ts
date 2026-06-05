import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from 'typeorm';

export class AddProductionOrderSourcePayloadSnapshot1700000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('production_orders');

    if (!hasTable) {
      return;
    }

    const hasColumn = await queryRunner.hasColumn(
      'production_orders',
      'source_payload_snapshot',
    );

    if (hasColumn) {
      return;
    }

    await queryRunner.addColumn(
      'production_orders',
      new TableColumn({
        name: 'source_payload_snapshot',
        type: 'jsonb',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('production_orders');

    if (!hasTable) {
      return;
    }

    const hasColumn = await queryRunner.hasColumn(
      'production_orders',
      'source_payload_snapshot',
    );

    if (!hasColumn) {
      return;
    }

    await queryRunner.dropColumn(
      'production_orders',
      'source_payload_snapshot',
    );
  }
}
