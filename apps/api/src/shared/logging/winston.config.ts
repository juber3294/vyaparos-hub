import { utilities as nestWinstonModuleUtilities } from "nest-winston";
import winston from "winston";

export function createWinstonLogger(): winston.LoggerOptions {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    level: process.env.LOG_LEVEL ?? (isProduction ? "info" : "debug"),
    defaultMeta: { service: "vyaparos-api" },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.Console({
        format: isProduction
          ? winston.format.json()
          : winston.format.combine(
              winston.format.timestamp(),
              nestWinstonModuleUtilities.format.nestLike("VyaparOS", {
                prettyPrint: true,
                colors: true,
              }),
            ),
      }),
    ],
  };
}
