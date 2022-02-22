import * as joi from 'joi';
import axios from 'axios';
import { Test } from '@nestjs/testing';
import { HttpClientOmdbService } from './http-client-omdb.service';
import { ConfigModule } from '@nestjs/config';
import { OmdbDataDto } from '../dtos/omdb-data.dto';

describe('HttpClientOmdbService', () => {
  let httpClient: HttpClientOmdbService;
  const axiosMockGet = jest.spyOn(axios, 'get');
  axiosMockGet
    .mockResolvedValueOnce({
      data: {
        Title: 'Test',
        Genre: 'Test',
        Released: 'Test',
        Director: 'Test',
      },
    })
    .mockRejectedValueOnce(new Error('Error code 401'));

  beforeAll(async () => {
    const testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: joi
            .object({
              API_KEY: joi.string().required(),
            })
            .required(),
        }),
      ],
      providers: [HttpClientOmdbService],
    }).compile();
    httpClient = testModule.get<HttpClientOmdbService>(HttpClientOmdbService);
  });

  it('Should be defined', () => {
    expect(httpClient).toBeDefined();
  });

  it('Should create proper params', async () => {
    const params = httpClient.createParams('Title');
    expect(params.t).toEqual('Title');
    expect(params.apikey).toBeDefined();
  });

  it('Should return OmdbData', async () => {
    const data: OmdbDataDto = await httpClient.search('test');
    expect(data).toBeInstanceOf(OmdbDataDto);
  });

  it('Should throw when error', async () => {
    try {
      await httpClient.search('throw');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
