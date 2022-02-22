import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OmdbDataDto } from '../dtos/omdb-data.dto';

// Abstracting the interaction with OMDB API with this service.
@Injectable()
export class HttpClientOmdbService {
  private readonly API_KEY: string;

  constructor(private readonly config: ConfigService) {
    this.API_KEY = this.config.get<string>('API_KEY');
  }

  createParams(title: string) {
    // Utility function to create the query parameters.
    return {
      apikey: this.API_KEY,
      t: title,
    };
  }

  async search(title: string): Promise<OmdbDataDto> {
    // Send http request to the API.
    const response = await axios.get('https://www.omdbapi.com', {
      params: this.createParams(title),
    });
    return new OmdbDataDto(
      response.data.Title,
      response.data.Genre,
      response.data.Released,
      response.data.Director,
    );
  }
}
