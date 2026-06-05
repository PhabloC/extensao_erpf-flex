import type { UserRole } from '@/types/api';
import type { Status } from '@/types/status';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: Status;
  createdAt: Date;
}
