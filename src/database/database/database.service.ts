import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserInfo } from '../../jwt/jwt.service';
import { Movie } from '@prisma/client';
import { OmdbDataDto } from '../../dtos/omdb-data.dto';

// This service abstracts the implementation of database framework used.
@Injectable()
export class DatabaseService {
  constructor(private readonly database: PrismaService) {}

  // SELECT * FROM Movie WHERE user_id=userId;
  async getMoviesForUser(userId: number): Promise<Movie[]> {
    return await this.database.movie.findMany({
      where: {
        user_id: {
          equals: userId,
        },
      },
    });
  }

  // SELECT * FROM Movie WHERE user_id=userId AND created_at > 1st 00:00:00 of current month;
  async getThisMonthsCreatedMovies(userId: number): Promise<Movie[]> {
    const thisMonth = new Date();
    thisMonth.setUTCDate(1);
    thisMonth.setUTCHours(0, 0, 0, 0);
    return await this.database.movie.findMany({
      where: {
        AND: [
          {
            created_at: {
              gt: thisMonth,
            },
          },
          {
            user_id: userId,
          },
        ],
      },
    });
  }

  // INSERT INTO Movie (title, released, genre, director, user_id) VALUES (...);
  async createMovie(movie: OmdbDataDto, user: UserInfo) {
    await this.database.movie.create({
      data: {
        title: movie.Title,
        released: movie.Released,
        genre: movie.Genre,
        director: movie.Director,
        user_id: user.userId,
      },
    });
  }
}
