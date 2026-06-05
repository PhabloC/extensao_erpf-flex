import { subHours } from 'date-fns';

import { adaptUser } from '@/services/adapters/adaptUser';
import type { DashboardSummary } from '@/types/dashboard';
import { withRetry } from '@/utils/decorators/withRetry';

const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 250);
  });

  const currentUser = adaptUser({
    id: 1,
    first_name: 'Ada',
    last_name: 'Lovelace',
    email: 'ada@example.com',
    role: 'admin',
    status: 'active',
    created_at: subHours(new Date(), 72).toISOString(),
  });

  return {
    currentUser,
    metrics: [
      {
        id: 'architecture',
        label: 'Architecture',
        value: 'Layered',
        detail: 'Pages -> Hooks -> Services -> API',
        status: 'active',
      },
      {
        id: 'quality',
        label: 'Quality Guardrails',
        value: 'Strict TS',
        detail: 'ESLint, Prettier and Vitest configured',
        status: 'active',
      },
      {
        id: 'delivery',
        label: 'Delivery Model',
        value: 'Agent-first',
        detail: 'Documentation prepared for code agents and humans',
        status: 'pending',
      },
    ],
    tasks: [
      {
        id: 'task-1',
        name: 'Wire route guards',
        owner: 'Frontend Platform',
        status: 'active',
        updatedAt: subHours(new Date(), 2).toISOString(),
      },
      {
        id: 'task-2',
        name: 'Add API adapters',
        owner: 'Services Layer',
        status: 'pending',
        updatedAt: subHours(new Date(), 6).toISOString(),
      },
      {
        id: 'task-3',
        name: 'Connect real backend',
        owner: 'Domain Team',
        status: 'blocked',
        updatedAt: subHours(new Date(), 18).toISOString(),
      },
    ],
    lastUpdatedAt: new Date().toISOString(),
  };
};

export const getDashboardSummary = withRetry(fetchDashboardSummary, {
  retries: 1,
  delayMs: 150,
});
