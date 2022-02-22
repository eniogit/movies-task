import { Test } from '@nestjs/testing';
import { UserAuthenticationGuard } from './user-authentication.guard';
import { JwtService, UserInfo } from '../../jwt/jwt.service';
import { ExecutionContext, HttpException } from '@nestjs/common';

describe('UserAuthenticationGuard', () => {
  let guard: UserAuthenticationGuard;
  const mockRequest = {
    header: jest
      .fn()
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce('string no match')
      .mockReturnValue('Bearer 1234'),
  };
  const context = {
    getType: jest.fn().mockReturnValue('http'),
    getArgByIndex: jest.fn().mockReturnValue(mockRequest),
  };

  beforeAll(async () => {
    const testModule = await Test.createTestingModule({
      providers: [UserAuthenticationGuard],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return {
            verify: jest
              .fn()
              .mockRejectedValueOnce(new Error())
              .mockResolvedValue(new UserInfo()),
          };
        }
      })
      .compile();
    guard = testModule.get<UserAuthenticationGuard>(UserAuthenticationGuard);
  });

  it('Should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('Should throw when Authorization header is not present.', async () => {
    try {
      await guard.canActivate(<ExecutionContext>(<unknown>context));
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it("Should throw when Authorization header doesn't match regex", async () => {
    try {
      await guard.canActivate(<ExecutionContext>(<unknown>context));
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it("Should throw when token isn't valid", async () => {
    try {
      await guard.canActivate(<ExecutionContext>(<unknown>context));
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('Should return true when token is valid', async () => {
    const returnValue = await guard.canActivate(
      <ExecutionContext>(<unknown>context),
    );
    expect(returnValue).toBeTruthy();
  });
});
