import * as Sentry from '@sentry/nestjs';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { RequestHandler } from 'express';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const SentryInit = (Sentry as any).init as (
  options: Record<string, unknown>,
) => void;

const ApiRef = apiReference as any as (options: {
  title: string;
  theme: string;
  content: unknown;
}) => RequestHandler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  void SentryInit({
    dsn: process.env.DSN_SENTRY,
    sendDefaultPii: true,
    environment: process.env.NODE_ENV || 'development',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('my-thesis-brain API')
    .setDescription('This is description of the my-thesis-brain API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const OpenApiSpecification = ApiRef({
    title: 'my-thesis-brain API',
    theme: 'default',
    content: document,
  });

  app.use('/api/iqro', OpenApiSpecification);

  await app.listen(3000);
}
void bootstrap();
