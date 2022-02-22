import { DatabaseService } from './database.service';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { Movie } from '@prisma/client';

describe('DatabaseService', () => {
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const testModule = await Test.createTestingModule({
      providers: [DatabaseService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {
            movie: {
              findMany: (): Movie[] => {
                return [
                  {
                    id: 1234,
                    created_at: new Date(),
                    title: 'Test',
                    released: 'Test',
                    genre: 'Test',
                    director: 'Test',
                    user_id: 1234,
                  },
                ];
              },
            },
          };
        }
      })
      .compile();
    databaseService = testModule.get(DatabaseService);
  });

  it('Should be defined', () => {
    expect(databaseService).toBeDefined();
  });

  it('Should return array of movies', async () => {
    const movies = await databaseService.getMoviesForUser(1234);
    expect(movies.length).toEqual(1);
  });
});
