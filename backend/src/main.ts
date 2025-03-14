import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
    passphrase: process.env.SSL_PASS
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions
  });

  app.enableCors({
    origin: ["http://localhost:5173", "https://localhost:5173", /^https?:\/\/192\.168\.1\.\d+$/],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
