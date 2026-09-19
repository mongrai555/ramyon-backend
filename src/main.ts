import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Set global prefix
  app.setGlobalPrefix('api');

  // Serve static files from the uploads directory
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // CORS: in production only the origins named in FRONTEND_URL may call the
  // API. Locally we stay permissive so phones on the shop wifi can hit the
  // dev server by LAN address without editing env files.
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  const allowedOrigins = (configService.get<string>('FRONTEND_URL') || '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);

  if (isProd && allowedOrigins.length === 0) {
    throw new Error(
      'FRONTEND_URL must list the frontend origin(s) in production, e.g. https://shop.example.com',
    );
  }

  app.enableCors({
    origin: isProd
      ? (
          origin: string | undefined,
          callback: (err: Error | null, allow?: boolean) => void,
        ) => {
          // Same-origin and server-to-server calls arrive without an Origin
          // Refuse by withholding the CORS header, not by throwing: the
          // browser blocks the response either way, and the server keeps
          // answering 200 instead of logging a 500 for every stray origin.
          const allowed =
            !origin || allowedOrigins.includes(origin.replace(/\/$/, ''));
          callback(null, allowed);
        }
      : true,
    credentials: true,
  });

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('PORT') || 3000;
  // 0.0.0.0 so the container/host maps the port; localhost-only bindings
  // look healthy in the logs and refuse every request from outside.
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port} (prefix /api)`);
}
bootstrap();
