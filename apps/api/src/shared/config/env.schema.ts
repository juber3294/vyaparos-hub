import { z } from "zod";

const numeric = (fallback: number) =>
  z
    .union([z.string(), z.number()])
    .default(fallback)
    .transform((value) => Number(value));

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  APP_NAME: z.string().default("VyaparOS API"),
  API_PREFIX: z.string().default("/api/v1"),
  PORT: numeric(4000),
  PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("30d"),
  CORS_ORIGINS: z.string().min(1),
  COOKIE_DOMAIN: z.string().optional(),
  RATE_LIMIT_TTL: numeric(60000),
  RATE_LIMIT_LIMIT: numeric(300),
  PASSWORD_PEPPER: z.string().min(16),
  ENCRYPTION_KEY: z.string().min(16),
  LOCAL_STORAGE_PATH: z.string().default("./storage"),
  AWS_REGION: z.string().default("ap-south-1"),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});
