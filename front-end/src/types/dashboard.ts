import type { Status } from '@/types/status';
import type { User } from '@/types/user';

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  status: Status;
}

export interface DashboardTask {
  id: string;
  name: string;
  owner: string;
  status: Status;
  updatedAt: string;
}

export interface DashboardSummary {
  currentUser: User;
  metrics: DashboardMetric[];
  tasks: DashboardTask[];
  lastUpdatedAt: string;
}
