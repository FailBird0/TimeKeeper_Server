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
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://localhost:5173", // from the hosting device
        /https:\/\/192\.168\.\d+\.\d+:\d+/ // from the local network
      ];

      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        if (typeof allowedOrigin === "string") {
          return allowedOrigin === origin;
        }
        return allowedOrigin.test(origin);
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  });
  
  await app.listen(process.env.PORT ?? 3000, "0.0.0.0");
}
bootstrap();
