import { ClassSerializerInterceptor, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./shared/filters/http-exception.filter";
import { RequestLoggingInterceptor } from "./shared/interceptors/request-logging.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);
  const reflector = app.get(Reflector);
  const apiPrefix = config.getOrThrow<string>("API_PREFIX").replace(/^\//, "");

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.enableCors({
    origin: config.getOrThrow<string>("CORS_ORIGINS").split(","),
    credentials: true,
  });

  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new RequestLoggingInterceptor(new Logger(RequestLoggingInterceptor.name)),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("VyaparOS Enterprise API")
    .setDescription(
      "Multi-tenant ERP API for Indian wholesale, retail, distribution and trading businesses.",
    )
    .setVersion("1.0.0")
    .addBearerAuth()
    .addApiKey({ type: "apiKey", name: "x-tenant-id", in: "header" }, "tenant")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = config.getOrThrow<number>("PORT");
  await app.listen(port, "0.0.0.0");
  Logger.log(`VyaparOS API listening on ${port}`, "Bootstrap");
}

void bootstrap();
