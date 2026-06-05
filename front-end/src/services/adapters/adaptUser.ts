import type { ApiUserDTO } from '@/types/api';
import type { User } from '@/types/user';

export function adaptUser(apiUser: ApiUserDTO): User {
  return {
    id: String(apiUser.id),
    fullName: `${apiUser.first_name} ${apiUser.last_name}`.trim(),
    email: apiUser.email,
    role: apiUser.role,
    status: apiUser.status,
    createdAt: new Date(apiUser.created_at),
  };
}
