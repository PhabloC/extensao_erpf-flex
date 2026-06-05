import { Injectable, Logger } from '@nestjs/common';

interface ExternalAnalyticsClient {
  send(payload: {
    name: string;
    metadata: Record<string, string>;
    createdAt: string;
  }): Promise<void>;
}

class ConsoleAnalyticsClient implements ExternalAnalyticsClient {
  private readonly logger = new Logger(ConsoleAnalyticsClient.name);

  send(payload: {
    name: string;
    metadata: Record<string, string>;
    createdAt: string;
  }) {
    this.logger.log(
      `analytics ${payload.name} ${JSON.stringify(payload.metadata)}`,
    );

    return Promise.resolve();
  }
}

@Injectable()
export class AnalyticsAdapter {
  private readonly client: ExternalAnalyticsClient =
    new ConsoleAnalyticsClient();

  async trackUserCreated(event: {
    userId: string;
    email: string;
    occurredAt: string;
  }) {
    await this.client.send({
      name: 'user.created',
      metadata: {
        userId: event.userId,
        email: event.email,
      },
      createdAt: event.occurredAt,
    });
  }

  async trackUserDeleted(event: {
    userId: string;
    email: string;
    occurredAt: string;
  }) {
    await this.client.send({
      name: 'user.deleted',
      metadata: {
        userId: event.userId,
        email: event.email,
      },
      createdAt: event.occurredAt,
    });
  }
}
