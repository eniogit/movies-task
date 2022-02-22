import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { MoviesController } from './controllers/movies/movies.controller';
import { JwtService } from './jwt/jwt.service';
import { DatabaseService } from './database/database/database.service';
import { PrismaService } from './database/prisma/prisma.service';
import { HttpClientOmdbService } from './omdb/http-client-omdb.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      // ConfigModule to fetch data from .env and process.env and merge them together. Also validates against a schema and exits on errors or missing configuration.
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
  providers: [
    JwtService,
    DatabaseService,
    PrismaService,
    HttpClientOmdbService,
  ],
})
export class AppModule {}
