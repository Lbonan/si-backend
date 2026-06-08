import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo global: todas as rotas ficam em /api/v1/...
  app.setGlobalPrefix('api/v1');

  // ValidationPipe global: valida automaticamente todos os DTOs da aplicação.
  // whitelist: remove campos que não estão no DTO (segurança).
  // forbidNonWhitelisted: retorna erro se vier campo extra.
  // transform: converte automaticamente strings para os tipos corretos (ex: "1" -> 1).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS: permite que o frontend (Next.js em outra porta) chame esta API.
  // Em produção, troque '*' pelo domínio real do frontend.
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend rodando em http://localhost:${port}/api/v1`);
}

bootstrap();
