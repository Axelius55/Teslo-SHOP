import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Remueve todo lo que no está incluido en los DTOs.
      forbidNonWhitelisted: true, //Retorna bad request si hay propiedades en el objeto no requeridas.
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('TESLO SHOP')
    .setDescription('Products, users, files and auth')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT || 3000);
  logger.log(process.env.PORT || 3000);

}
bootstrap();
