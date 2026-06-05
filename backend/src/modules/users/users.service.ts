import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { formatISO } from 'date-fns';

import { type RequestUser } from '../../common/decorators/current-user.decorator';
import {
  comparePassword,
  hashPassword,
} from '../../common/utils/password.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { type PublicUser, type UserEntity } from './entities/user.entity';
import {
  USER_CREATED_EVENT,
  USER_DELETED_EVENT,
  type UserCreatedEvent,
  type UserDeletedEvent,
} from './events/user.events';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.usersRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      role: dto.role,
    });

    const event: UserCreatedEvent = {
      userId: user.id,
      email: user.email,
      occurredAt: formatISO(new Date()),
    };

    this.eventEmitter.emit(USER_CREATED_EVENT, event);

    return this.toPublicUser(user);
  }

  async findAll() {
    const users = await this.usersRepository.findAll();

    return users.map((user) => this.toPublicUser(user));
  }

  async findOne(id: string) {
    const user = await this.findOneEntity(id);

    return this.toPublicUser(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.ensureEmailAvailable(dto.email, id);

    const updateInput = {
      email: dto.email,
      name: dto.name,
      role: dto.role,
      passwordHash: dto.password ? await hashPassword(dto.password) : undefined,
    };
    const updatedUser = await this.usersRepository.update(id, {
      ...updateInput,
      phone: dto.phone,
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found.');
    }

    return this.toPublicUser(updatedUser);
  }

  async remove(id: string) {
    const deletedUser = await this.usersRepository.delete(id);

    if (!deletedUser) {
      throw new NotFoundException('User not found.');
    }

    const event: UserDeletedEvent = {
      userId: deletedUser.id,
      email: deletedUser.email,
      occurredAt: formatISO(new Date()),
    };

    this.eventEmitter.emit(USER_DELETED_EVENT, event);

    return {
      deleted: true,
      userId: deletedUser.id,
    };
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.usersRepository.findByEmail(email.toLowerCase());

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return user;
  }

  async buildRequestUser(userId: string): Promise<RequestUser> {
    const user = await this.findOneEntity(userId);

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }

  toPublicUser(user: UserEntity): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async findOneEntity(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  private async ensureEmailAvailable(
    email: string | undefined,
    userId: string,
  ) {
    if (!email) {
      return;
    }

    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException('A user with this email already exists.');
    }
  }
}
