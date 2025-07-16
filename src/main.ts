import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ Enable CORS for frontend on port 5173
  app.enableCors({
    origin: 'http://localhost:5173', // your frontend dev server
    credentials: true,              // allows cookies/auth headers if needed
  });

  app.useGlobalPipes(new ValidationPipe());

  // Serve uploaded images
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(3000);
}
bootstrap();

