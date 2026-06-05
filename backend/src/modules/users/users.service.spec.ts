import { EventEmitter2 } from '@nestjs/event-emitter';

import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './entities/user.entity';
import { InMemoryUsersRepository } from './users.in-memory.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService(
      new InMemoryUsersRepository(),
      new EventEmitter2(),
    );
  });

  it('creates a user without leaking the password hash', async () => {
    const dto: CreateUserDto = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'password123',
      role: UserRole.ADMIN,
    };

    const user = await usersService.create(dto);

    expect(user.email).toBe('ada@example.com');
    expect(user.name).toBe('Ada Lovelace');
    expect('passwordHash' in user).toBe(false);
  });
});
