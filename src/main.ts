import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  //Configuración de los validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true, //No se requiere para GraphQL. Genera error cuando se envían mas de 1 Args
    })
  );

  await app.listen(process.env.PORT);
  logger.log(`App running on port ${process.env.PORT}`);  

}
bootstrap();
