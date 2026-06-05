import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { AppVersionModule } from './modules/app-version/app-version.module';
import { ProductionOrdersModule } from './modules/production-orders/production-orders.module';
import { UsersModule } from './modules/users/users.module';
import { appConfig } from './config/app.config';
import { createTypeOrmOptions, databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env.local', '.env'],
      load: [appConfig, databaseConfig],
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: createTypeOrmOptions,
    }),
    AppVersionModule,
    UsersModule,
    AuthModule,
    ProductionOrdersModule,
  ],
})
export class AppModule {}
