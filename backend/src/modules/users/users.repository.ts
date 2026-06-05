import { type UserEntity, UserRole } from './entities/user.entity';

export interface CreateUserRecordInput {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
}

export interface UpdateUserRecordInput {
  name?: string;
  email?: string;
  phone?: string;
  passwordHash?: string;
  role?: UserRole;
}

export abstract class UsersRepository {
  abstract create(input: CreateUserRecordInput): Promise<UserEntity>;
  abstract findAll(): Promise<UserEntity[]>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract update(
    id: string,
    input: UpdateUserRecordInput,
  ): Promise<UserEntity | null>;
  abstract delete(id: string): Promise<UserEntity | null>;
}
