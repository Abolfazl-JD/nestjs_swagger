import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // class validator initialization
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  // add cookies property to the request object
  app.use(cookieParser())
  // initializing SwaggerUI
  const config = new DocumentBuilder()
  .setTitle('Todos App')
  .setDescription('This app is created for learning Swagger UI')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);

  // Remove the 201 status code from the login request
  delete document.paths['/users/login']['post']['responses']['201']

  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
}
bootstrap();
