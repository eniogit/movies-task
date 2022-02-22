import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// This class is used to validate against certain requests and as a model for documentation purposes.
export class CreateMovieDto {
  @IsString()
  @ApiProperty()
  title: string;
}
