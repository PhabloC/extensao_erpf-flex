import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  type CreateUserRecordInput,
  type UpdateUserRecordInput,
  UsersRepository,
} from './users.repository';
import { type UserEntity } from './entities/user.entity';

@Injectable()
export class InMemoryUsersRepository extends UsersRepository {
  private readonly users = new Map<string, UserEntity>();

  create(input: CreateUserRecordInput) {
    const now = new Date();
    const user: UserEntity = {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      passwordHash: input.passwordHash,
      role: input.role,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(user.id, user);

    return Promise.resolve(this.cloneUser(user));
  }

  findAll() {
    return Promise.resolve(
      Array.from(this.users.values()).map((user) => this.cloneUser(user)),
    );
  }

  findById(id: string) {
    const user = this.users.get(id);

    return Promise.resolve(user ? this.cloneUser(user) : null);
  }

  findByEmail(email: string) {
    const user = Array.from(this.users.values()).find(
      (entry) => entry.email === email,
    );

    return Promise.resolve(user ? this.cloneUser(user) : null);
  }

  update(id: string, input: UpdateUserRecordInput) {
    const existingUser = this.users.get(id);

    if (!existingUser) {
      return Promise.resolve(null);
    }

    const updatedUser: UserEntity = {
      ...existingUser,
      ...input,
      phone: input.phone ?? existingUser.phone,
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);

    return Promise.resolve(this.cloneUser(updatedUser));
  }

  delete(id: string) {
    const existingUser = this.users.get(id);

    if (!existingUser) {
      return Promise.resolve(null);
    }

    this.users.delete(id);

    return Promise.resolve(this.cloneUser(existingUser));
  }

  private cloneUser(user: UserEntity): UserEntity {
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  }
}
