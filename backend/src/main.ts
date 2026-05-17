import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";
import { ApiExceptionFilter } from "./common/filters/api-exception.filter";
import { getApiRoutePrefix, getFrontendOrigins } from "./config/deployment";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const routePrefix = getApiRoutePrefix();
  if (routePrefix) {
    app.setGlobalPrefix(routePrefix);
  }

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new ApiExceptionFilter());

  const allowedOrigins = getFrontendOrigins();
  type CorsAllowCallback = (err: Error | null, allow?: boolean) => void;

  app.enableCors({
    origin: (origin: string | undefined, callback: CorsAllowCallback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalized = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalized)) {
        callback(null, true);
        return;
      }

      if (
        process.env.VERCEL === "1" &&
        normalized.endsWith(".vercel.app")
      ) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`), false);
    },
    credentials: true,
  });

  const port = config.get<number>("PORT", 3001);
  await app.listen(port);
}

bootstrap();
