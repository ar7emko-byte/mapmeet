import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export const signUpSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(24, 'Username must be 24 characters or fewer.')
    .regex(/^[a-zA-Z0-9_.]+$/, 'Letters, numbers, "_" and "." only.'),
  displayName: z
    .string()
    .min(1, 'Display name is required.')
    .max(40, 'Display name must be 40 characters or fewer.'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email.'),
});

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(80),
  description: z.string().max(500).optional().or(z.literal('')),
  emoji: z.string().min(1, 'Pick an emoji.').max(8),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date.'),
  event_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Invalid time.'),
  max_participants: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable(),
  visibility: z.enum(['public', 'private']).default('public'),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type EventInput = z.infer<typeof eventSchema>;
