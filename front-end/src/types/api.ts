import type { Status } from '@/types/status';

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface ApiUserDTO {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  status: Status;
  created_at: string;
}
