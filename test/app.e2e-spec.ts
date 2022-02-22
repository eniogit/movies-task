import * as request from 'supertest';
import axios from 'axios';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma/prisma.service';

describe('MovieController (e2e)', () => {
  let app: INestApplication;
  let basicToken;
  let premiumToken;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prismaService = app.get(PrismaService);
    prismaService.enableShutdownHooks(app);
    await app.init();
  });

  beforeEach(async () => {
    await prismaService.movie.deleteMany({});
    basicToken = await (
      await axios.post(
        'http://auth:3000/auth',
        {
          username: 'basic-thomas',
          password: 'sR-_pcoow-27-6PAwCD8',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    ).data.token;
    premiumToken = await (
      await axios.post(
        'http://auth:3000/auth',
        {
          username: 'premium-jim',
          password: 'GBLtTyq3E_UNjFnpo9m6',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    ).data.token;
  });

  it('/GET /movies should return 401 when without Authorization header.', async () => {
    await request(app.getHttpServer()).get('/movies').expect(401);
  });

  it('/GET /movies should return 401 when token is invalid.', async () => {
    await request(app.getHttpServer())
      .get('/movies')
      .set('Authorization', 'dumb')
      .expect(401);
  });

  it('/GET /movies should return empty with correct token and no entry in db.', async () => {
    const response = await (
      await request(app.getHttpServer())
        .get('/movies')
        .set('Authorization', `Bearer ${basicToken}`)
        .expect(200)
    ).body;
    expect(response.length).toEqual(0);
  });

  it('/GET /movies should 2 entries if user created 2 entries.', async () => {
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${basicToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Good Will Hunting',
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${basicToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Good Will Hunting',
      })
      .expect(201);
    const response = await (
      await request(app.getHttpServer())
        .get('/movies')
        .set('Authorization', `Bearer ${basicToken}`)
        .expect(200)
    ).body;
    expect(response.length).toEqual(2);
  });

  it('/POST /movies should return 401 when without Authorization header.', async () => {
    await request(app.getHttpServer()).post('/movies').expect(401);
  });

  it('/POST /movies should return 500 when no payload.', () => {
    return request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${basicToken}`)
      .set('Content-Type', 'application/json')
      .expect(400);
  });

  it('/POST /movies should return 201 when payload is sent.', () => {
    return request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${basicToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Good Will Hunting',
      })
      .expect(201);
  });

  it('/POST /movies should return 403 when basic user has reached his quota.', async () => {
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${basicToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Captain Marvel',
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${basicToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'The Incredible',
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${basicToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Avengers',
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${basicToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Mama mia',
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${basicToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Bologna',
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${basicToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Mulan',
      })
      .expect(403);
  });

  it('/POST /movies should return 201 after a premium user has passed the quota of basic user.', async () => {
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${premiumToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Captain Marvel',
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${premiumToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'The Incredible',
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${premiumToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Avengers',
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${premiumToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Mama mia',
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${premiumToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Bologna',
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${premiumToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Mulan',
      })
      .expect(201);
  });
});
