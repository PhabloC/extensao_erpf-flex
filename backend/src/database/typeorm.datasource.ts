import 'dotenv/config';

import { join } from 'node:path';

import { DataSource } from 'typeorm';

import { UserEntity } from '../modules/users/entities/user.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'backend',
  entities: [UserEntity],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  synchronize: false,
});
