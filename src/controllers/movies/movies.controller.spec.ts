import { MoviesController } from './movies.controller';
import { Test } from '@nestjs/testing';
import { JwtService, UserInfo } from '../../jwt/jwt.service';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { HttpClientOmdbService } from '../../omdb/http-client-omdb.service';
import { DatabaseService } from '../../database/database/database.service';
import { Movie } from '@prisma/client';
import { CreateMovieDto } from '../../dtos/create-movie.dto';

describe('MoviesController', () => {
  let moviesController: MoviesController;

  const createMovieMockFn = jest.fn().mockResolvedValue(1);
  const getThisMonthsCreatedMovies = jest.fn().mockResolvedValue([1, 1, 1]);

  beforeAll(async () => {
    const testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: joi
            .object({
              JWT_SECRET: joi.string().required(),
              API_KEY: joi.string().required(),
            })
            .required(),
          validationOptions: {
            abortEarly: true,
          },
        }),
      ],
      controllers: [MoviesController],
      providers: [JwtService],
    })
      .useMocker((token) => {
        if (token === DatabaseService) {
          return {
            getMoviesForUser: () => {
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
            getThisMonthsCreatedMovies: getThisMonthsCreatedMovies,
            createMovie: createMovieMockFn,
          };
        }
        if (token === HttpClientOmdbService) {
          return {
            search: jest.fn().mockResolvedValue(null),
          };
        }
      })
      .compile();
    moviesController = testModule.get(MoviesController);
  });

  it('Should be defined', () => {
    expect(moviesController).toBeDefined();
  });

  it('Should return movies for user', async () => {
    const user = new UserInfo();
    user.userId = 1234;
    const movies: Movie[] = await moviesController.getMovies(user);
    expect(movies.length).toBeGreaterThan(0);
  });

  it('Should create new movie', async () => {
    const user = new UserInfo();
    user.userId = 1234;
    user.role = 'basic';
    await moviesController.postMovie(user, new CreateMovieDto());
    expect(getThisMonthsCreatedMovies.mock.calls.length).toBe(1);
    expect(createMovieMockFn.mock.calls.length).toBe(1);
  });
});
