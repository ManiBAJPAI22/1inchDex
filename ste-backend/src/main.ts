import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('Maroon POC API')
    .setDescription('Maroon POC backend API')
    .setVersion('1.0')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);

  const port = process.env.PORT || 4000;

  await app.listen(port);

  console.log(`\n\n
  --------------------------------------------------
    Server is listening http://localhost:${port}
  --------------------------------------------------
  \n`);
}
bootstrap();
