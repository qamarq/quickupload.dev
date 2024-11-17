import { z } from 'zod';

// regex of file name: small letters, capital letters, numbers, underscores, dashes, dots
export const FILE_NAME_REGEX = /^[a-zA-Z0-9_.-]+$/

// regex of extensions: . followed by small letters and dots
export const FILE_EXTENSION_REGEX = /^\.[a-z.]+$/

// regex of file types: application/ followed by small letters, slashes, and small letters
export const FILE_TYPE_REGEX = /^application\/[a-z]+\/[a-z]+$/

export const requestSchema = z.object({
  name: z.string().regex(FILE_NAME_REGEX, 'Invalid file name'),
  extension: z.string().regex(FILE_EXTENSION_REGEX),
  type: z.string(),
  captcha: z.string()
})