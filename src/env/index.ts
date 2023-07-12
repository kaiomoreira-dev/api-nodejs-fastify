import { z } from 'zod'
import 'dotenv/config'
import { config } from 'dotenv'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test', override: true })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().nonempty(),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']).default('sqlite'),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.log('Failed to parse environment', _env.error.format())

  throw new Error('Failed to parse environmentt')
}

export const env = _env.data
