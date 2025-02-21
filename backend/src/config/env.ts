import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.union([z.string(), z.number()]).default('1d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
})

const env = envSchema.parse(process.env)

export default env
