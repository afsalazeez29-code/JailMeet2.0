import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });

const environmentSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().min(1).default('5d'),
  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
});

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  const missingFields = parsedEnvironment.error.issues
    .map((issue) => issue.path.join('.'))
    .filter(Boolean)
    .join(', ');

  throw new Error(`Invalid backend environment configuration: ${missingFields}`);
}

const environment = parsedEnvironment.data;

const config = {
  port: environment.PORT,
  nodeEnv: environment.NODE_ENV,
  jwtSecret: environment.JWT_SECRET,
  jwtExpiresIn: environment.JWT_EXPIRES_IN,
  corsOrigin: environment.CORS_ORIGIN,
  databaseUrl: environment.DATABASE_URL,
  cloudinaryCloudName: environment.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: environment.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: environment.CLOUDINARY_API_SECRET,
};

export default config;
