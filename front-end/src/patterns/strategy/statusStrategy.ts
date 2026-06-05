import type { Status } from '@/types/status';

type BadgeTone = 'success' | 'warning' | 'danger';

export interface StatusPresentationStrategy {
  label: string;
  description: string;
  tone: BadgeTone;
}

const statusStrategies: Record<Status, StatusPresentationStrategy> = {
  active: {
    label: 'Active',
    description: 'Execution is on track and available for delivery.',
    tone: 'success',
  },
  pending: {
    label: 'Pending',
    description: 'Execution is waiting on a follow-up decision or action.',
    tone: 'warning',
  },
  blocked: {
    label: 'Blocked',
    description: 'Execution is paused because an external dependency failed.',
    tone: 'danger',
  },
  backlog: {
    label: 'Backlog',
    description: 'Order captured and waiting to enter operational flow.',
    tone: 'warning',
  },
  ready: {
    label: 'Ready',
    description: 'Order is ready to start execution.',
    tone: 'success',
  },
  in_progress: {
    label: 'In Progress',
    description: 'Order is currently being executed.',
    tone: 'success',
  },
  paused: {
    label: 'Paused',
    description: 'Order was temporarily paused and needs attention.',
    tone: 'warning',
  },
  done: {
    label: 'Done',
    description: 'Order has been completed successfully.',
    tone: 'success',
  },
  canceled: {
    label: 'Canceled',
    description: 'Order was canceled and is no longer active.',
    tone: 'danger',
  },
};

export function getStatusStrategy(status: Status) {
  return statusStrategies[status];
}
