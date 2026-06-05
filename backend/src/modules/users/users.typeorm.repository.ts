import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  type CreateUserRecordInput,
  type UpdateUserRecordInput,
  UsersRepository,
} from './users.repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class TypeOrmUsersRepository extends UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super();
  }

  async create(input: CreateUserRecordInput) {
    const user = this.repository.create({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      passwordHash: input.passwordHash,
      role: input.role,
    });

    return this.repository.save(user);
  }

  async findAll() {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(id: string) {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.repository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async update(id: string, input: UpdateUserRecordInput) {
    const existingUser = await this.findById(id);

    if (!existingUser) {
      return null;
    }

    await this.repository.update(id, input);

    return this.findById(id);
  }

  async delete(id: string) {
    const existingUser = await this.findById(id);

    if (!existingUser) {
      return null;
    }

    await this.repository.delete(id);

    return existingUser;
  }
}
