export const USER_CREATED_EVENT = 'user.created';
export const USER_DELETED_EVENT = 'user.deleted';

export interface UserCreatedEvent {
  userId: string;
  email: string;
  occurredAt: string;
}

export interface UserDeletedEvent {
  userId: string;
  email: string;
  occurredAt: string;
}
