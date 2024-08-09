import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.use(function (request: Request, response: Response, next: NextFunction) {
    response.setHeader('Access-Control-Allow-Origin', 'https://blogverse-team-t.vercel.app/');
    next();
  });
   app.enableCors({
    origin: '*', // Allow specific origin
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization','Access-Control-Allow-Origin'],
    // credentials: true, // If you need to allow credentials (cookies, headers)
  });

  

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('BlogVerse REST API')
    .setDescription(
      "A rest API to list user's blogs and create blogs, authorization implemented using JWT token. The API is made using NestJs.",
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  });

  await app.listen(3000);
}
bootstrap();
