import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionInterceptor } from './common/interceptors/http-exception.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.enableCors({ origin: '*',								methods:'GET,HEAD,PUT,PATCH,POST,DELETE',					credentials:true, });

  app.useGlobalInterceptors(new HttpExceptionInterceptor());
  
  const config = new DocumentBuilder()
    .setTitle('DOCSYS BFF Swagger')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .addTag('BFF APIS')
    .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    },
    'access-token',
  )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000,'0.0.0.0');
}
bootstrap();
