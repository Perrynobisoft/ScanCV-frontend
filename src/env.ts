import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SERVER_URL: z.string().url().optional(),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: 'VITE_',

  client: {
    // App Configuration
    VITE_APP_TITLE: z.string().min(1).optional(),

    // API Configuration
    VITE_APP_API_URL: z.string().url(),
    VITE_APP_TIMEOUT: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .optional()
      .default('30000'),

    // Development Configuration
    VITE_APP_ENABLE_LOGGER: z
      .enum(['true', 'false'])
      .optional()
      .default('false'),
    VITE_APP_ENABLE_MSW: z.enum(['true', 'false']).optional().default('false'),

    // Optional Configuration
    VITE_APP_ENVIRONMENT: z
      .enum(['development', 'staging', 'production'])
      .optional(),
    VITE_APP_VERSION: z.string().optional(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: import.meta.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
})
