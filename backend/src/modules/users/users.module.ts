import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyticsAdapter } from '../../patterns/adapters/analyticsAdapter';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { UsersEventsListener } from './events/users-events.listener';
import { InMemoryUsersRepository } from './users.in-memory.repository';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { TypeOrmUsersRepository } from './users.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    InMemoryUsersRepository,
    TypeOrmUsersRepository,
    {
      provide: UsersRepository,
      inject: [ConfigService, InMemoryUsersRepository, TypeOrmUsersRepository],
      useFactory: (
        configService: ConfigService,
        inMemoryRepository: InMemoryUsersRepository,
        typeOrmRepository: TypeOrmUsersRepository,
      ) => {
        const isDatabaseEnabled =
          configService.get<boolean>('database.enabled') ?? false;

        return isDatabaseEnabled ? typeOrmRepository : inMemoryRepository;
      },
    },
    UsersEventsListener,
    AnalyticsAdapter,
  ],
  exports: [UsersService],
})
export class UsersModule {}
