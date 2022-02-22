import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class UserInfo {
  userId: number;
  role: string;
}

// This service 'promisifies' the jsonwebtoken API.
@Injectable()
export class JwtService {
  private readonly secret: string;

  constructor(private readonly config: ConfigService) {
    this.secret = config.get('JWT_SECRET');
  }

  async verify(token): Promise<UserInfo> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, (error, decoded) => {
        if (error) {
          reject(error);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
