import * as DotEnv from 'dotenv';
DotEnv.config({ path: `${__dirname}/.env` });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8080);
}
bootstrap();
