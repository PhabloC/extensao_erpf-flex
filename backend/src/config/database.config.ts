import { registerAs } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = registerAs('database', () => ({
  enabled: process.env.DATABASE_ENABLED === 'true',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  name: process.env.DB_NAME ?? 'backend',
}));

export function createTypeOrmOptions(): TypeOrmModuleOptions {
  const database = databaseConfig();

  return {
    type: 'postgres',
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.name,
    autoLoadEntities: true,
    synchronize: false,
    logging: false,
    retryAttempts: 1,
    migrations: ['dist/database/migrations/*.js'],
    migrationsTableName: 'migrations_history',
    manualInitialization: !database.enabled,
  };
}
