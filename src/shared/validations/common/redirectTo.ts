import { z } from 'zod'

/**
 * Validates that redirectTo is a valid path (starts with / and doesn't contain invalid characters)
 * This prevents runtime errors when using new URL() with malformed URLs
 * Allows paths with query strings (e.g., /dashboard?param=value)
 */
const pathRegex = /^\/[^\s<>"']*$/

export const redirectToSearchSchema = z.object({
  redirectTo: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true // Optional, so empty is valid
        // Must start with / and not contain whitespace or other invalid path characters
        return pathRegex.test(val) && val.length > 0
      },
      {
        message: 'redirectTo must be a valid path starting with /',
      },
    ),
})
