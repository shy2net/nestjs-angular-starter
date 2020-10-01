import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Returns the authenticated user associated with this request.
 */
export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
