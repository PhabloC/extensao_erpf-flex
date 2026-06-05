import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AnalyticsAdapter } from '../../../patterns/adapters/analyticsAdapter';
import {
  USER_CREATED_EVENT,
  USER_DELETED_EVENT,
  type UserCreatedEvent,
  type UserDeletedEvent,
} from './user.events';

@Injectable()
export class UsersEventsListener {
  private readonly logger = new Logger(UsersEventsListener.name);

  constructor(private readonly analyticsAdapter: AnalyticsAdapter) {}

  @OnEvent(USER_CREATED_EVENT)
  async handleUserCreated(event: UserCreatedEvent) {
    this.logger.log(`user created ${event.userId}`);
    await this.analyticsAdapter.trackUserCreated(event);
  }

  @OnEvent(USER_DELETED_EVENT)
  async handleUserDeleted(event: UserDeletedEvent) {
    this.logger.log(`user deleted ${event.userId}`);
    await this.analyticsAdapter.trackUserDeleted(event);
  }
}
