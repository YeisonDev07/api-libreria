import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos no definidos en el DTO
      forbidNonWhitelisted: true, // lanza error si hay campos extra
      transform: true, // convierte automáticamente a los tipos definidos en el DTO
    }),
  );

  // ✅ Configurar Swagger para documentación de API
  const config = new DocumentBuilder()
    .setTitle('API Librería')
    .setDescription('Documentación de la API de la librería')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
