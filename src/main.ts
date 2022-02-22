import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // ValidationPipe will automatically validate data coming on requests.

  // Configurations for Prisma.
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // Configuring Open API for documentation.
  const config = new DocumentBuilder()
    .setTitle('Movies API')
    .setDescription('Create and retrieve movies.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //////////////////////////////////////////

  await app.listen(3001);
}

bootstrap().then(); // This .then() removes a linting warning.
