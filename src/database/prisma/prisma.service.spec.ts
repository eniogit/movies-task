import { Test } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    const testModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();
    prisma = testModule.get(PrismaService);
  });

  it('Should be defined', () => {
    expect(prisma).toBeDefined();
  });
});
