import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfo } from '../../jwt/jwt.service';

// Decorator to provide the user object after authenticated.
export const User = createParamDecorator(
  (data, context: ExecutionContext): UserInfo => {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new Error(
        'User decorator needs to be used in conjunction with UserAuthorizationGuard',
      );
    }
    return request.user;
  },
);
