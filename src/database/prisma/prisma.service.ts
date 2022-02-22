import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Boilerplate code to integrate Prisma into Nest.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  onModuleInit(): any {
    this.$connect();
  }

  enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
