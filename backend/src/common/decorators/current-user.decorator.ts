import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export interface RequestUser {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export const CurrentUser = createParamDecorator(
  (property: keyof RequestUser | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = request.user;

    if (!property) {
      return user;
    }

    return user?.[property];
  },
);
