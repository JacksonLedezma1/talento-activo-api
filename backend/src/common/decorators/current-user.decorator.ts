import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../../users/users.entities';

export type AuthUser = {
  sub: number;
  email: string;
  role: Role;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthUser }>();
    return request.user;
  },
);
