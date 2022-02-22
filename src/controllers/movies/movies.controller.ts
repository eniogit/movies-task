import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserAuthenticationGuard } from '../../guards/user-authentication/user-authentication.guard';
import { HttpClientOmdbService } from '../../omdb/http-client-omdb.service';
import { CreateMovieDto } from '../../dtos/create-movie.dto';
import { User } from './user.decorator';
import { DatabaseService } from '../../database/database/database.service';
import { UserInfo } from '../../jwt/jwt.service';
import { MovieResponseDto } from '../../dtos/movie-response.dto';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Indicates unauthorized request.' })
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly omdbClient: HttpClientOmdbService,
    private readonly database: DatabaseService,
  ) {}

  @Get()
  @UseGuards(UserAuthenticationGuard)
  @ApiOkResponse({ type: [MovieResponseDto] })
  async getMovies(@User() user: UserInfo) {
    return await this.database.getMoviesForUser(user.userId);
  }

  @Post()
  @UseGuards(UserAuthenticationGuard)
  @ApiForbiddenResponse({
    description:
      'If a basic user tries to create a sixth movie for this month. Quota maxed.',
  })
  async postMovie(@User() user: UserInfo, @Body() request: CreateMovieDto) {
    if (user.role === 'basic') {
      const movies = await this.database.getThisMonthsCreatedMovies(
        user.userId,
      );
      if (movies.length >= 5) {
        throw new HttpException('Quota maxed', 403);
      }
    }
    const searchResult = await this.omdbClient.search(request.title);
    await this.database.createMovie(searchResult, user);
  }
}
