import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '../../jwt/jwt.service';

// Guard to authenticate requests based on Bearer token and JWT.
@Injectable()
export class UserAuthenticationGuard implements CanActivate {
  private readonly tokenRegex = /^Bearer (\S+)$/; // This regex captures the token in the header.

  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() === 'http') {
      const request = context.getArgByIndex(0);
      const authHeader = request.header('Authorization');
      if (authHeader && this.tokenRegex.test(authHeader)) {
        const token = this.tokenRegex.exec(authHeader)[1];
        try {
          request.user = await this.jwt.verify(token);
          return true;
        } catch (error) {
          throw new HttpException('Not authorized', 401);
        }
      } else {
        throw new HttpException('Not authorized', 401);
      }
    }
  }
}
