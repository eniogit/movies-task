import * as jwt from 'jsonwebtoken';
import * as joi from 'joi';
import { JwtService, UserInfo } from './jwt.service';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

describe('JwtService', () => {
  let jwtService: JwtService;
  const mockedJwt = jest.spyOn(jwt, 'verify');
  mockedJwt.mockImplementation((token: string, __, cb) => {
    if (token === '1') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cb(undefined, new UserInfo());
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cb(new Error());
    }
  });

  beforeAll(async () => {
    const testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: joi
            .object({
              JWT_SECRET: joi.string().required(),
            })
            .required(),
        }),
      ],
      providers: [JwtService],
    }).compile();
    jwtService = testModule.get<JwtService>(JwtService);
  });

  it('Should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  it('Should reject', async () => {
    try {
      await jwtService.verify('2');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('Should resolve', async () => {
    const decoded: UserInfo = await jwtService.verify('1');
    expect(decoded).toBeInstanceOf(UserInfo);
  });
});
