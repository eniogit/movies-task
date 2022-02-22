import { ApiProperty } from '@nestjs/swagger';

// This class is used to model a movie response for documentation purposes.
export class MovieResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  title: string;
  @ApiProperty()
  released: string;
  @ApiProperty()
  genre: string;
  @ApiProperty()
  director: string;
  @ApiProperty()
  user_id: number;
}
